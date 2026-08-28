package com.workforce.hrm.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.EmployeeRequestDTO;
import com.workforce.hrm.dto.response.EmployeeResponseDTO;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Designation;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.mapper.EmployeeMapper;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.DesignationRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.AuditLogService;
import com.workforce.hrm.service.EmployeeService;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final AuditLogService auditLogService;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            DesignationRepository designationRepository,
            AuditLogService auditLogService) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO request) {
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new IllegalArgumentException("Employee code already exists");
        }
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        Department department = resolveDepartment(request.getDepartmentId());
        Designation designation = resolveDesignation(request.getDesignationId(), department);
        Employee employee = new Employee();
        applyRequest(employee, request, department, designation);
        Employee saved = employeeRepository.save(employee);
        audit("CREATE", saved);
        return EmployeeMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> getEmployees(String search, EmployeeStatus status,
            Long companyId, Long departmentId, Long designationId, Pageable pageable) {
        Long scopedCompanyId = resolveReadCompany(companyId);
        Long scopedDepartmentId = resolveReadDepartment(departmentId);
        return employeeRepository.findWorkspaceEmployees(scopedCompanyId, status,
                scopedDepartmentId, designationId, normalizeSearch(search), pageable)
                .map(EmployeeMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> getEmployeesForReport(String search, EmployeeStatus status,
            Long departmentId, Long designationId, LocalDate fromDate, LocalDate toDate,
            Pageable pageable) {
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new IllegalArgumentException("From date cannot be after to date");
        }
        Long scopedCompanyId = resolveReadCompany(null);
        Long scopedDepartmentId = resolveReadDepartment(departmentId);
        return employeeRepository.findWorkspaceEmployeesForReport(scopedCompanyId, status,
                scopedDepartmentId, designationId, fromDate, toDate, normalizeSearch(search), pageable)
                .map(EmployeeMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getAllEmployees() {
        return getEmployees(null, null, null, null, null,
                Pageable.unpaged()).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeById(Long id) {
        return EmployeeMapper.toResponseDTO(getEmployeeEntity(id));
    }

    @Override
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO request) {
        Employee existing = getEmployeeEntity(id);
        employeeRepository.findByEmployeeCode(request.getEmployeeCode()).ifPresent(match -> {
            if (!match.getEmployeeId().equals(existing.getEmployeeId())) {
                throw new IllegalArgumentException("Employee code already exists");
            }
        });
        employeeRepository.findByEmail(request.getEmail()).ifPresent(match -> {
            if (!match.getEmployeeId().equals(existing.getEmployeeId())) {
                throw new IllegalArgumentException("Email already exists");
            }
        });
        Department department = resolveDepartment(request.getDepartmentId());
        Designation designation = resolveDesignation(request.getDesignationId(), department);
        applyRequest(existing, request, department, designation);
        Employee saved = employeeRepository.save(existing);
        audit("UPDATE", saved);
        return EmployeeMapper.toResponseDTO(saved);
    }

    @Override
    public EmployeeResponseDTO updateEmployeeStatus(Long id, EmployeeStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("Employee status is required");
        }
        Employee employee = getEmployeeEntity(id);
        employee.setStatus(status);
        Employee saved = employeeRepository.save(employee);
        audit("UPDATE_STATUS", saved);
        return EmployeeMapper.toResponseDTO(saved);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeEntity(id);
        employee.setStatus(EmployeeStatus.INACTIVE);
        employeeRepository.save(employee);
        audit("DEACTIVATE", employee);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeByCode(String code) {
        Employee employee = employeeRepository.findByEmployeeCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        validateCompanyAccess(employee);
        return EmployeeMapper.toResponseDTO(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getEmployeesByDepartment(Long departmentId) {
        Department department = resolveDepartment(departmentId);
        return employeeRepository.findByDepartmentDepartmentId(department.getDepartmentId()).stream()
                .map(EmployeeMapper::toResponseDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getEmployeesByStatus(EmployeeStatus status) {
        return getEmployees(null, status, null, null, null, Pageable.unpaged()).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> searchEmployees(String keyword, Pageable pageable) {
        return getEmployees(keyword, null, null, null, null, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeProfile(Long id) {
        return getEmployeeById(id);
    }

    private Employee getEmployeeEntity(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        validateCompanyAccess(employee);
        return employee;
    }

    private Department resolveDepartment(Long departmentId) {
        if (departmentId == null) {
            throw new IllegalArgumentException("Department is required");
        }
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));
        if (!SecurityUtils.isSuperAdmin()) {
            Long companyId = requiredCompanyId();
            if (department.getCompany() == null || !companyId.equals(department.getCompany().getId())) {
                throw new AccessDeniedException("Department belongs to another company");
            }
            if (isManagerRole() && !requiredManagerDepartmentId().equals(department.getDepartmentId())) {
                throw new AccessDeniedException("Managers can only access their own department");
            }
        }
        return department;
    }

    private Designation resolveDesignation(Long designationId, Department department) {
        if (designationId == null) {
            throw new IllegalArgumentException("Designation is required");
        }
        Designation designation = designationRepository.findById(designationId)
                .orElseThrow(() -> new IllegalArgumentException("Designation not found"));
        if (designation.getDepartment() == null || !department.getDepartmentId()
                .equals(designation.getDepartment().getDepartmentId())) {
            throw new IllegalArgumentException("Designation does not belong to the selected department");
        }
        return designation;
    }

    private void applyRequest(Employee employee, EmployeeRequestDTO request,
            Department department, Designation designation) {
        employee.setEmployeeCode(request.getEmployeeCode().trim());
        employee.setFirstName(request.getFirstName().trim());
        employee.setLastName(blankToNull(request.getLastName()));
        employee.setEmail(request.getEmail().trim().toLowerCase());
        employee.setPhone(blankToNull(request.getPhone()));
        employee.setGender(blankToNull(request.getGender()));
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setSalary(request.getSalary());
        employee.setStatus(request.getStatus() == null ? EmployeeStatus.ACTIVE : request.getStatus());
        employee.setDepartment(department);
        employee.setDesignation(designation);
        employee.setCompany(department.getCompany());
    }

    private Long resolveReadCompany(Long requestedCompanyId) {
        return SecurityUtils.isSuperAdmin() ? requestedCompanyId : requiredCompanyId();
    }

    private void validateCompanyAccess(Employee employee) {
        if (SecurityUtils.isSuperAdmin()) {
            return;
        }
        Long companyId = requiredCompanyId();
        if (employee.getCompany() == null || !companyId.equals(employee.getCompany().getId())) {
            throw new AccessDeniedException("Employee belongs to another company");
        }
        if (isManagerRole() && (employee.getDepartment() == null
                || !requiredManagerDepartmentId().equals(employee.getDepartment().getDepartmentId()))) {
            throw new AccessDeniedException("Managers can only access employees in their own department");
        }
    }

    private Long requiredCompanyId() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        if (companyId == null) {
            throw new AccessDeniedException("No company assigned to the current user");
        }
        return companyId;
    }

    private Long resolveReadDepartment(Long requestedDepartmentId) {
        if (!isManagerRole()) {
            return requestedDepartmentId;
        }
        Long managerDepartmentId = requiredManagerDepartmentId();
        if (requestedDepartmentId != null && !managerDepartmentId.equals(requestedDepartmentId)) {
            throw new AccessDeniedException("Managers can only access their own department");
        }
        return managerDepartmentId;
    }

    private Long requiredManagerDepartmentId() {
        String email = SecurityUtils.getCurrentUserEmail();
        Employee manager = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("No employee profile is linked to the manager"));
        if (manager.getCompany() == null || !requiredCompanyId().equals(manager.getCompany().getId())
                || manager.getDepartment() == null) {
            throw new AccessDeniedException("The manager has no authorised team scope");
        }
        return manager.getDepartment().getDepartmentId();
    }

    private boolean isManagerRole() {
        return "MANAGER".equalsIgnoreCase(SecurityUtils.getCurrentRole());
    }

    private String normalizeSearch(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private void audit(String action, Employee employee) {
        auditLogService.saveLog(action, "EMPLOYEE",
                action + " employee: " + employee.getEmployeeCode(), "SYSTEM");
    }
}
