package com.workforce.hrm.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.workforce.hrm.dto.request.EmployeeRequestDTO;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Designation;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.DesignationRepository;
import com.workforce.hrm.repository.EmployeeDocumentRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.UserRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.AuditLogService;
import com.workforce.hrm.service.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeDocumentRepository employeeDocumentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final AuditLogService auditLogService;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            EmployeeDocumentRepository employeeDocumentRepository,
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            DesignationRepository designationRepository,
            AuditLogService auditLogService) {

        this.employeeRepository = employeeRepository;
        this.employeeDocumentRepository = employeeDocumentRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.auditLogService = auditLogService;
    }

    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    @Override
    public Employee createEmployee(EmployeeRequestDTO request) {

        // -----------------------------------------------------
        // CHECK EMPLOYEE CODE
        // -----------------------------------------------------

        if (employeeRepository.existsByEmployeeCode(
                request.getEmployeeCode())) {

            throw new RuntimeException(
                    "Employee Code Already Exists");
        }

        // -----------------------------------------------------
        // CHECK EMAIL
        // -----------------------------------------------------

        if (employeeRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "Email Already Exists");
        }

        Department department;
        Designation designation;

        // =====================================================
        // SUPER ADMIN
        // =====================================================

        if (SecurityUtils.isSuperAdmin()) {

            department =
                    departmentRepository
                            .findById(request.getDepartmentId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Department Not Found"));

            designation =
                    designationRepository
                            .findById(request.getDesignationId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Designation Not Found"));
        }

        // =====================================================
        // COMPANY USER
        // =====================================================

        else {

            Long companyId =
                    SecurityUtils.getCurrentCompanyId();

            if (companyId == null) {

                throw new RuntimeException(
                        "Company not assigned to current user");
            }

            // -------------------------------------------------
            // DEPARTMENT MUST BELONG TO CURRENT COMPANY
            // -------------------------------------------------

            department =
                    departmentRepository
                            .findByDepartmentIdAndCompanyId(
                                    request.getDepartmentId(),
                                    companyId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Department Not Found or Access Denied"));

            // -------------------------------------------------
            // DESIGNATION MUST BELONG TO CURRENT COMPANY
            // -------------------------------------------------

            designation =
                    designationRepository
                            .findByDesignationIdAndDepartmentCompanyId(
                                    request.getDesignationId(),
                                    companyId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Designation Not Found or Access Denied"));
        }

        // =====================================================
        // VALIDATE DESIGNATION → DEPARTMENT
        // =====================================================

        if (designation.getDepartment() == null ||
                !designation.getDepartment()
                        .getDepartmentId()
                        .equals(
                                department.getDepartmentId())) {

            throw new RuntimeException(
                    "Designation does not belong to selected Department");
        }

        // =====================================================
        // VALIDATE COMPANY
        // =====================================================

        if (department.getCompany() == null) {

            throw new RuntimeException(
                    "Selected Department is not assigned to a company");
        }

        // =====================================================
        // CREATE EMPLOYEE
        // =====================================================

        Employee employee = new Employee();

        // -----------------------------------------------------
        // BASIC DETAILS
        // -----------------------------------------------------

        employee.setEmployeeCode(
                request.getEmployeeCode());

        employee.setFirstName(
                request.getFirstName());

        employee.setLastName(
                request.getLastName());

        employee.setEmail(
                request.getEmail());

        employee.setPhone(
                request.getPhone());

        // -----------------------------------------------------
        // PERSONAL DETAILS
        // -----------------------------------------------------

        employee.setGender(
                request.getGender());

        employee.setDateOfBirth(
                request.getDateOfBirth());

        // -----------------------------------------------------
        // EMPLOYMENT DETAILS
        // -----------------------------------------------------

        employee.setJoiningDate(
                request.getJoiningDate());

        employee.setSalary(
                request.getSalary());

        /*
         * If frontend does not send status during CREATE,
         * employee will automatically become ACTIVE.
         */
        employee.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : EmployeeStatus.ACTIVE);

        // -----------------------------------------------------
        // ORGANIZATION DETAILS
        // -----------------------------------------------------

        employee.setDepartment(
                department);

        employee.setDesignation(
                designation);

        // -----------------------------------------------------
        // IMPORTANT FIX
        // -----------------------------------------------------
        // employees.company_id is NOT NULL.
        // Company is derived from the selected department.

        employee.setCompany(
                department.getCompany());

        // =====================================================
        // SAVE
        // =====================================================

        Employee savedEmployee =
                employeeRepository.save(employee);

        // =====================================================
        // AUDIT LOG
        // =====================================================

        auditLogService.saveLog(
                "CREATE",
                "EMPLOYEE",
                "Created Employee : "
                        + savedEmployee.getEmployeeCode()
                        + " - "
                        + savedEmployee.getFirstName(),
                "SYSTEM");

        return savedEmployee;
    }

    // =========================================================
    // GET ALL EMPLOYEES
    // =========================================================

    @Override
    public List<Employee> getAllEmployees() {

        if (SecurityUtils.isSuperAdmin()) {

            return employeeRepository.findAll();
        }

        Long companyId =
                SecurityUtils.getCurrentCompanyId();

        if (companyId == null) {

            throw new RuntimeException(
                    "Company not assigned to current user");
        }

        return employeeRepository
                .findByDepartmentCompanyId(companyId);
    }

    // =========================================================
    // GET EMPLOYEE BY ID
    // =========================================================

    @Override
    public Employee getEmployeeById(Long id) {

        Employee employee =
                employeeRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee Not Found"));

        validateCompanyAccess(employee);

        return employee;
    }

    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    @Override
    public Employee updateEmployee(
            Long id,
            Employee employee) {

        Employee existingEmployee =
                getEmployeeById(id);

        existingEmployee.setEmployeeCode(
                employee.getEmployeeCode());

        existingEmployee.setFirstName(
                employee.getFirstName());

        existingEmployee.setLastName(
                employee.getLastName());

        existingEmployee.setEmail(
                employee.getEmail());

        existingEmployee.setPhone(
                employee.getPhone());

        existingEmployee.setGender(
                employee.getGender());

        existingEmployee.setDateOfBirth(
                employee.getDateOfBirth());

        existingEmployee.setJoiningDate(
                employee.getJoiningDate());

        existingEmployee.setSalary(
                employee.getSalary());

        existingEmployee.setStatus(
                employee.getStatus());

        existingEmployee.setResignationDate(
                employee.getResignationDate());

        /*
         * Department / Designation are intentionally
         * not changed here.
         *
         * This prevents a company user from changing
         * an employee's tenant/company accidentally.
         */

        Employee updatedEmployee =
                employeeRepository.save(existingEmployee);

        auditLogService.saveLog(
                "UPDATE",
                "EMPLOYEE",
                "Updated Employee : "
                        + updatedEmployee.getEmployeeCode()
                        + " - "
                        + updatedEmployee.getFirstName(),
                "SYSTEM");

        return updatedEmployee;
    }

    // =========================================================
    // DELETE EMPLOYEE
    // =========================================================

    @Override
    public void deleteEmployee(Long id) {

        Employee employee =
                getEmployeeById(id);

        employeeRepository.delete(employee);

        auditLogService.saveLog(
                "DELETE",
                "EMPLOYEE",
                "Deleted Employee : "
                        + employee.getEmployeeCode()
                        + " - "
                        + employee.getFirstName(),
                "SYSTEM");
    }

    // =========================================================
    // GET EMPLOYEE BY CODE
    // =========================================================

    @Override
    public Employee getEmployeeByCode(String code) {

        Employee employee =
                employeeRepository
                        .findByEmployeeCode(code)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee Not Found"));

        validateCompanyAccess(employee);

        return employee;
    }

    // =========================================================
    // GET EMPLOYEES BY DEPARTMENT
    // =========================================================

    @Override
    public List<Employee> getEmployeesByDepartment(
            Long departmentId) {

        if (SecurityUtils.isSuperAdmin()) {

            return employeeRepository
                    .findByDepartmentDepartmentId(
                            departmentId);
        }

        Long companyId =
                SecurityUtils.getCurrentCompanyId();

        if (companyId == null) {

            throw new RuntimeException(
                    "Company not assigned to current user");
        }

        departmentRepository
                .findByDepartmentIdAndCompanyId(
                        departmentId,
                        companyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department Not Found or Access Denied"));

        return employeeRepository
                .findByDepartmentDepartmentId(
                        departmentId);
    }

    // =========================================================
    // GET EMPLOYEES BY STATUS
    // =========================================================

    @Override
    public List<Employee> getEmployeesByStatus(
            EmployeeStatus status) {

        if (SecurityUtils.isSuperAdmin()) {

            return employeeRepository
                    .findByStatus(status);
        }

        Long companyId =
                SecurityUtils.getCurrentCompanyId();

        if (companyId == null) {

            throw new RuntimeException(
                    "Company not assigned to current user");
        }

        return employeeRepository
                .findByDepartmentCompanyId(companyId)
                .stream()
                .filter(employee ->
                        employee.getStatus() == status)
                .toList();
    }

    // =========================================================
    // SEARCH EMPLOYEES
    // =========================================================

    @Override
    public Page<Employee> searchEmployees(
            String keyword,
            Pageable pageable) {

        return employeeRepository
                .findByFirstNameContainingIgnoreCase(
                        keyword,
                        pageable);
    }

    // =========================================================
    // EMPLOYEE PROFILE
    // =========================================================

    @Override
    public Employee getEmployeeProfile(Long id) {

        return getEmployeeById(id);
    }

    // =========================================================
    // TENANT SECURITY
    // =========================================================

    private void validateCompanyAccess(
            Employee employee) {

        if (SecurityUtils.isSuperAdmin()) {
            return;
        }

        Long currentCompanyId =
                SecurityUtils.getCurrentCompanyId();

        if (!belongsToCompany(
                employee,
                currentCompanyId)) {

            throw new RuntimeException(
                    "Access Denied: Employee belongs to another company");
        }
    }

    // =========================================================
    // CHECK EMPLOYEE COMPANY
    // =========================================================

    private boolean belongsToCompany(
            Employee employee,
            Long companyId) {

        if (employee == null ||
                companyId == null ||
                employee.getDepartment() == null ||
                employee.getDepartment().getCompany() == null) {

            return false;
        }

        return companyId.equals(
                employee.getDepartment()
                        .getCompany()
                        .getId()
        );
    }
}