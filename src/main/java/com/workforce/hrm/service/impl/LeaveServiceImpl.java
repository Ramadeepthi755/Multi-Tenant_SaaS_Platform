package com.workforce.hrm.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.LeaveRequestDTO;
import com.workforce.hrm.dto.response.LeaveResponseDTO;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Leave;
import com.workforce.hrm.enums.LeaveStatus;
import com.workforce.hrm.mapper.LeaveMapper;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.LeaveRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.AuditLogService;
import com.workforce.hrm.service.LeaveService;

@Service
@Transactional
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;
    private final AuditLogService auditLogService;

    public LeaveServiceImpl(
            LeaveRepository leaveRepository,
            EmployeeRepository employeeRepository,
            AuditLogService auditLogService) {

        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
        this.auditLogService = auditLogService;
    }

    // =========================================================
    // CREATE LEAVE
    // =========================================================

    @Override
    public LeaveResponseDTO createLeave(
            LeaveRequestDTO request) {

        validateRequest(request);
        validateDates(request);

        Employee employee =
                getEmployeeAndValidateAccess(
                        request.getEmployeeId());

        Leave leave =
                LeaveMapper.toEntity(
                        request,
                        employee);

        /*
         * Client must never decide the initial status.
         */
        leave.setStatus(
                LeaveStatus.PENDING);

        Leave savedLeave =
                leaveRepository.save(leave);

        auditLogService.saveLog(
                "CREATE",
                "LEAVE",
                "Applied Leave : "
                        + employee.getEmployeeCode()
                        + " - "
                        + employee.getFirstName(),
                "SYSTEM");

        return LeaveMapper.toResponseDTO(
                savedLeave);
    }

    // =========================================================
    // GET ALL LEAVES - PAGINATED
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public Page<LeaveResponseDTO> getAllLeaves(
            Pageable pageable) {

        Page<Leave> leaves;

        /*
         * SUPER_ADMIN can see all companies.
         */
        if (SecurityUtils.isSuperAdmin()) {

            leaves =
                    leaveRepository.findAll(
                            pageable);

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            leaves =
                    leaveRepository
                            .findByEmployeeDepartmentCompanyId(
                                    companyId,
                                    pageable);
        }

        return leaves.map(
                LeaveMapper::toResponseDTO);
    }

    // =========================================================
    // GET LEAVE BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public LeaveResponseDTO getLeaveById(
            Long id) {

        if (id == null) {

            throw new IllegalArgumentException(
                    "Leave ID is required");
        }

        Leave leave =
                getLeaveAndValidateAccess(id);

        return LeaveMapper.toResponseDTO(
                leave);
    }

    // =========================================================
    // UPDATE LEAVE
    // =========================================================

    @Override
    public LeaveResponseDTO updateLeave(
            Long id,
            LeaveRequestDTO request) {

        if (id == null) {

            throw new IllegalArgumentException(
                    "Leave ID is required");
        }

        validateRequest(request);
        validateDates(request);

        Leave existingLeave =
                getLeaveAndValidateAccess(id);

        Employee employee =
                getEmployeeAndValidateAccess(
                        request.getEmployeeId());

        /*
         * Do not allow editing approved/rejected
         * leave through normal update.
         */
        if (existingLeave.getStatus() != null
                && existingLeave.getStatus()
                        != LeaveStatus.PENDING) {

            throw new IllegalStateException(
                    "Only pending leave can be updated");
        }

        existingLeave.setLeaveType(
                request.getLeaveType());

        existingLeave.setStartDate(
                request.getStartDate());

        existingLeave.setEndDate(
                request.getEndDate());

        existingLeave.setReason(
                request.getReason());

        existingLeave.setEmployee(
                employee);

        /*
         * Status intentionally remains PENDING.
         */

        Leave updatedLeave =
                leaveRepository.save(
                        existingLeave);

        auditLogService.saveLog(
                "UPDATE",
                "LEAVE",
                "Updated Leave : "
                        + employee.getEmployeeCode()
                        + " - "
                        + employee.getFirstName(),
                "SYSTEM");

        return LeaveMapper.toResponseDTO(
                updatedLeave);
    }

    // =========================================================
    // DELETE LEAVE
    // =========================================================

    @Override
    public void deleteLeave(
            Long id) {

        Leave leave =
                getLeaveAndValidateAccess(id);

        leaveRepository.delete(leave);

        auditLogService.saveLog(
                "DELETE",
                "LEAVE",
                "Deleted Leave : "
                        + getEmployeeName(leave),
                "SYSTEM");
    }

    // =========================================================
    // GET EMPLOYEE LEAVES - PAGINATED
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public Page<LeaveResponseDTO> getEmployeeLeaves(
            Long employeeId,
            Pageable pageable) {

        getEmployeeAndValidateAccess(
                employeeId);

        Page<Leave> leaves;

        if (SecurityUtils.isSuperAdmin()) {

            leaves =
                    leaveRepository
                            .findByEmployeeEmployeeId(
                                    employeeId,
                                    pageable);

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            leaves =
                    leaveRepository
                            .findByEmployeeEmployeeIdAndEmployeeDepartmentCompanyId(
                                    employeeId,
                                    companyId,
                                    pageable);
        }

        return leaves.map(
                LeaveMapper::toResponseDTO);
    }

    // =========================================================
    // GET LEAVES BY STATUS - PAGINATED
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public Page<LeaveResponseDTO> getLeavesByStatus(
            LeaveStatus status,
            Pageable pageable) {

        if (status == null) {

            throw new IllegalArgumentException(
                    "Leave status is required");
        }

        Page<Leave> leaves;

        if (SecurityUtils.isSuperAdmin()) {

            leaves =
                    leaveRepository.findByStatus(
                            status,
                            pageable);

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            leaves =
                    leaveRepository
                            .findByStatusAndEmployeeDepartmentCompanyId(
                                    status,
                                    companyId,
                                    pageable);
        }

        return leaves.map(
                LeaveMapper::toResponseDTO);
    }

    // =========================================================
    // APPROVE LEAVE
    // =========================================================

    @Override
    public LeaveResponseDTO approveLeave(
            Long leaveId) {

        Leave leave =
                getLeaveAndValidateAccess(
                        leaveId);

        if (leave.getStatus()
                != LeaveStatus.PENDING) {

            throw new IllegalStateException(
                    "Only pending leave can be approved");
        }

        leave.setStatus(
                LeaveStatus.APPROVED);

        Leave approvedLeave =
                leaveRepository.save(leave);

        auditLogService.saveLog(
                "APPROVE",
                "LEAVE",
                "Approved Leave : "
                        + getEmployeeName(leave),
                "SYSTEM");

        return LeaveMapper.toResponseDTO(
                approvedLeave);
    }

    // =========================================================
    // REJECT LEAVE
    // =========================================================

    @Override
    public LeaveResponseDTO rejectLeave(
            Long leaveId) {

        Leave leave =
                getLeaveAndValidateAccess(
                        leaveId);

        if (leave.getStatus()
                != LeaveStatus.PENDING) {

            throw new IllegalStateException(
                    "Only pending leave can be rejected");
        }

        leave.setStatus(
                LeaveStatus.REJECTED);

        Leave rejectedLeave =
                leaveRepository.save(leave);

        auditLogService.saveLog(
                "REJECT",
                "LEAVE",
                "Rejected Leave : "
                        + getEmployeeName(leave),
                "SYSTEM");

        return LeaveMapper.toResponseDTO(
                rejectedLeave);
    }

    // =========================================================
    // FIND LEAVE + SECURITY
    // =========================================================

    private Leave getLeaveAndValidateAccess(
            Long leaveId) {

        Leave leave =
                leaveRepository
                        .findById(leaveId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Leave not found with ID: "
                                                + leaveId));

        validateLeaveAccess(leave);

        return leave;
    }

    // =========================================================
    // VALIDATE LEAVE ACCESS
    // =========================================================

    private void validateLeaveAccess(
            Leave leave) {

        if (leave == null) {

            throw new AccessDeniedException(
                    "Leave not found");
        }

        if (SecurityUtils.isSuperAdmin()) {
            return;
        }

        Long currentCompanyId =
                getRequiredCurrentCompanyId();

        if (leave.getEmployee() == null) {

            throw new AccessDeniedException(
                    "Leave employee information not found");
        }

        Employee employee =
                leave.getEmployee();

        if (employee.getDepartment() == null) {

            throw new AccessDeniedException(
                    "Employee department information not found");
        }

        if (employee.getDepartment()
                .getCompany() == null) {

            throw new AccessDeniedException(
                    "Employee company information not found");
        }

        if (employee.getDepartment()
                .getCompany()
                .getId() == null) {

            throw new AccessDeniedException(
                    "Employee company ID not found");
        }

        Long leaveCompanyId =
                employee.getDepartment()
                        .getCompany()
                        .getId();

        if (!currentCompanyId.equals(
                leaveCompanyId)) {

            throw new AccessDeniedException(
                    "Access denied: leave belongs to another company");
        }
    }

    // =========================================================
    // FIND EMPLOYEE + SECURITY
    // =========================================================

    private Employee getEmployeeAndValidateAccess(
            Long employeeId) {

        if (employeeId == null) {

            throw new IllegalArgumentException(
                    "Employee ID is required");
        }

        Employee employee =
                employeeRepository
                        .findById(employeeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found with ID: "
                                                + employeeId));

        /*
         * SUPER_ADMIN has global access.
         */
        if (SecurityUtils.isSuperAdmin()) {
            return employee;
        }

        Long currentCompanyId =
                getRequiredCurrentCompanyId();

        if (employee.getDepartment() == null) {

            throw new AccessDeniedException(
                    "Employee department information not found");
        }

        if (employee.getDepartment()
                .getCompany() == null) {

            throw new AccessDeniedException(
                    "Employee company information not found");
        }

        if (employee.getDepartment()
                .getCompany()
                .getId() == null) {

            throw new AccessDeniedException(
                    "Employee company ID not found");
        }

        Long employeeCompanyId =
                employee.getDepartment()
                        .getCompany()
                        .getId();

        if (!currentCompanyId.equals(
                employeeCompanyId)) {

            throw new AccessDeniedException(
                    "Access denied: employee belongs to another company");
        }

        return employee;
    }

    // =========================================================
    // VALIDATE REQUEST
    // =========================================================

    private void validateRequest(
            LeaveRequestDTO request) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Leave request cannot be null");
        }

        if (request.getEmployeeId() == null) {

            throw new IllegalArgumentException(
                    "Employee ID is required");
        }

        if (request.getLeaveType() == null) {

            throw new IllegalArgumentException(
                    "Leave type is required");
        }
    }

    // =========================================================
    // VALIDATE DATES
    // =========================================================

    private void validateDates(
            LeaveRequestDTO request) {

        if (request.getStartDate() == null
                || request.getEndDate() == null) {

            throw new IllegalArgumentException(
                    "Start date and end date are required");
        }

        if (request.getEndDate()
                .isBefore(
                        request.getStartDate())) {

            throw new IllegalArgumentException(
                    "End date cannot be before start date");
        }
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
    // EMPLOYEE NAME
    // =========================================================

    private String getEmployeeName(
            Leave leave) {

        if (leave == null
                || leave.getEmployee() == null) {

            return "Unknown Employee";
        }

        Employee employee =
                leave.getEmployee();

        String code =
                employee.getEmployeeCode();

        String firstName =
                employee.getFirstName();

        if (code == null) {
            code = "";
        }

        if (firstName == null) {
            firstName = "";
        }

        String result =
                (code + " - " + firstName).trim();

        return result.equals("-")
                ? "Unknown Employee"
                : result;
    }
}