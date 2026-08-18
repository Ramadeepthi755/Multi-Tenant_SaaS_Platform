package com.workforce.hrm.service.impl;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.PayrollRequestDTO;
import com.workforce.hrm.dto.response.PayrollResponseDTO;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Payroll;
import com.workforce.hrm.mapper.PayrollMapper;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.PayrollRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.PayrollService;
import com.workforce.hrm.service.AuditLogService;

@Service
@Transactional
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final AuditLogService auditLogService;

    public PayrollServiceImpl(
            PayrollRepository payrollRepository,
            EmployeeRepository employeeRepository,
            AuditLogService auditLogService) {

        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.auditLogService = auditLogService;
    }

    // =========================================================
    // GENERATE PAYROLL
    // =========================================================

    @Override
    public PayrollResponseDTO generatePayroll(
            PayrollRequestDTO request) {

        /*
         * Validate employee + company access.
         *
         * Company A cannot generate payroll
         * for Company B employee.
         */
        Employee employee =
                getEmployeeAndValidateAccess(
                        request.getEmployeeId());

        // -----------------------------------------------------
        // Prevent duplicate payroll
        // -----------------------------------------------------

        payrollRepository
                .findByEmployeeEmployeeIdAndMonthAndYear(
                        employee.getEmployeeId(),
                        request.getMonth(),
                        request.getYear())
                .ifPresent(existing -> {

                    throw new RuntimeException(
                            "Payroll already generated for employee "
                                    + employee.getEmployeeCode()
                                    + " for "
                                    + request.getMonth()
                                    + " "
                                    + request.getYear());
                });

        // -----------------------------------------------------
        // Convert DTO -> Entity
        // -----------------------------------------------------

        Payroll payroll =
                PayrollMapper.toEntity(
                        request,
                        employee);

        Payroll savedPayroll =
                payrollRepository.save(payroll);

        auditLogService.saveLog(
                "CREATE",
                "PAYROLL",
                "Generated Payroll : "
                        + employee.getEmployeeCode()
                        + " - "
                        + employee.getFirstName()
                        + " ("
                        + request.getMonth()
                        + " "
                        + request.getYear()
                        + ")",
                "SYSTEM");

        return PayrollMapper.toResponseDTO(savedPayroll);
    }

    // =========================================================
    // GET ALL PAYROLLS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponseDTO> getAllPayrolls() {

        List<Payroll> payrolls;

        if (SecurityUtils.isSuperAdmin()) {

            /*
             * SUPER_ADMIN can see payroll
             * across all companies.
             */
            payrolls =
                    payrollRepository.findAll();

        } else {

            /*
             * Other company users can see only
             * their company's payroll.
             */
            Long companyId =
                    getRequiredCurrentCompanyId();

            payrolls =
                    payrollRepository
                            .findByEmployeeDepartmentCompanyId(
                                    companyId);
        }

        return convertToResponseList(payrolls);
    }

    // =========================================================
    // GET PAYROLL BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public PayrollResponseDTO getPayrollById(
            Long payrollId) {

        Payroll payroll =
                getPayrollAndValidateAccess(
                        payrollId);

        return PayrollMapper.toResponseDTO(
                payroll);
    }

    // =========================================================
    // GET PAYROLL BY EMPLOYEE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponseDTO> getPayrollByEmployee(
            Long employeeId) {

        /*
         * First make sure requested employee
         * belongs to current tenant.
         */
        getEmployeeAndValidateAccess(employeeId);

        List<Payroll> payrolls;

        if (SecurityUtils.isSuperAdmin()) {

            payrolls =
                    payrollRepository
                            .findByEmployeeEmployeeId(
                                    employeeId);

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            payrolls =
                    payrollRepository
                            .findByEmployeeEmployeeIdAndEmployeeDepartmentCompanyId(
                                    employeeId,
                                    companyId);
        }

        return convertToResponseList(payrolls);
    }

    // =========================================================
    // DELETE PAYROLL
    // =========================================================

    @Override
    public void deletePayroll(
            Long payrollId) {

        Payroll payroll =
                getPayrollAndValidateAccess(
                        payrollId);

        payrollRepository.delete(payroll);

        auditLogService.saveLog(
                "DELETE",
                "PAYROLL",
                "Deleted Payroll : "
                        + payroll.getEmployee().getEmployeeCode()
                        + " - "
                        + payroll.getEmployee().getFirstName()
                        + " ("
                        + payroll.getMonth()
                        + " "
                        + payroll.getYear()
                        + ")",
                "SYSTEM");
    }

    // =========================================================
    // SALARY SLIP
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public byte[] generateSalarySlip(
            Long payrollId) {

        Payroll payroll =
                getPayrollAndValidateAccess(
                        payrollId);

        /*
         * Keep your existing PDF generation logic here
         * if you already have one.
         *
         * This implementation generates a simple text
         * representation as bytes so the existing
         * service contract remains valid.
         */

        String employeeName = "";

        if (payroll.getEmployee() != null) {

            String firstName =
                    payroll.getEmployee()
                            .getFirstName() != null
                            ? payroll.getEmployee()
                                    .getFirstName()
                            : "";

            String lastName =
                    payroll.getEmployee()
                            .getLastName() != null
                            ? payroll.getEmployee()
                                    .getLastName()
                            : "";

            employeeName =
                    (firstName + " " + lastName)
                            .trim();
        }

        String salarySlip =
                "SALARY SLIP\n"
                        + "------------------------------\n"
                        + "Employee: "
                        + employeeName
                        + "\n"
                        + "Month: "
                        + payroll.getMonth()
                        + "\n"
                        + "Year: "
                        + payroll.getYear()
                        + "\n"
                        + "Basic Salary: "
                        + payroll.getBasicSalary()
                        + "\n"
                        + "Allowances: "
                        + payroll.getAllowances()
                        + "\n"
                        + "Deductions: "
                        + payroll.getDeductions()
                        + "\n"
                        + "Gross Salary: "
                        + payroll.getGrossSalary()
                        + "\n"
                        + "Net Salary: "
                        + payroll.getNetSalary()
                        + "\n"
                        + "Status: "
                        + payroll.getPayrollStatus()
                        + "\n";

        return salarySlip.getBytes(
                java.nio.charset.StandardCharsets.UTF_8);
    }

    // =========================================================
    // GET PAYROLL + VALIDATE TENANT
    // =========================================================

    private Payroll getPayrollAndValidateAccess(
            Long payrollId) {

        if (payrollId == null) {

            throw new RuntimeException(
                    "Payroll ID is required");
        }

        /*
         * SUPER_ADMIN can access payroll
         * from any company.
         */
        if (SecurityUtils.isSuperAdmin()) {

            return payrollRepository
                    .findById(payrollId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Payroll Not Found"));
        }

        Long companyId =
                getRequiredCurrentCompanyId();

        /*
         * Query itself contains company condition.
         *
         * Therefore another company's payroll
         * cannot be returned.
         */
        return payrollRepository
                .findByPayrollIdAndEmployeeDepartmentCompanyId(
                        payrollId,
                        companyId)
                .orElseThrow(() ->
                        new AccessDeniedException(
                                "Payroll not found or access denied"));
    }

    // =========================================================
    // GET EMPLOYEE + VALIDATE TENANT
    // =========================================================

    private Employee getEmployeeAndValidateAccess(
            Long employeeId) {

        if (employeeId == null) {

            throw new RuntimeException(
                    "Employee ID is required");
        }

        Employee employee =
                employeeRepository
                        .findById(employeeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee Not Found"));

        /*
         * SUPER_ADMIN can access employees
         * across all companies.
         */
        if (SecurityUtils.isSuperAdmin()) {
            return employee;
        }

        Long currentCompanyId =
                getRequiredCurrentCompanyId();

        /*
         * Employee must have:
         *
         * Employee
         *   -> Department
         *      -> Company
         */
        if (employee.getDepartment() == null ||
                employee.getDepartment()
                        .getCompany() == null ||
                employee.getDepartment()
                        .getCompany()
                        .getId() == null) {

            throw new AccessDeniedException(
                    "Employee company information not found");
        }

        Long employeeCompanyId =
                employee.getDepartment()
                        .getCompany()
                        .getId();

        if (!currentCompanyId.equals(
                employeeCompanyId)) {

            throw new AccessDeniedException(
                    "Access Denied: Employee belongs to another company");
        }

        return employee;
    }

    // =========================================================
    // CURRENT COMPANY
    // =========================================================

    private Long getRequiredCurrentCompanyId() {

        Long companyId =
                SecurityUtils.getCurrentCompanyId();

        if (companyId == null) {

            throw new AccessDeniedException(
                    "No company assigned to current user");
        }

        return companyId;
    }

    // =========================================================
    // ENTITY LIST -> RESPONSE DTO LIST
    // =========================================================

    private List<PayrollResponseDTO>
            convertToResponseList(
                    List<Payroll> payrolls) {

        return payrolls
                .stream()
                .map(PayrollMapper::toResponseDTO)
                .toList();
    }

	@Override
	public void generatePayrollForAllEmployees() {
		// TODO Auto-generated method stub
		
	}
}