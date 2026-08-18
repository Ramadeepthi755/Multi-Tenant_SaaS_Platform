package com.workforce.hrm.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.AttendanceRequestDTO;
import com.workforce.hrm.dto.response.AttendanceResponseDTO;
import com.workforce.hrm.entity.Attendance;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.mapper.AttendanceMapper;
import com.workforce.hrm.repository.AttendanceRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.AttendanceService;
import com.workforce.hrm.service.AuditLogService;

@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final AuditLogService auditLogService;

    public AttendanceServiceImpl(
            AttendanceRepository attendanceRepository,
            EmployeeRepository employeeRepository,
            AuditLogService auditLogService) {

        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.auditLogService = auditLogService;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @Override
    public AttendanceResponseDTO createAttendance(
            AttendanceRequestDTO request) {

        Employee employee =
                getEmployeeAndValidateAccess(
                        request.getEmployeeId());

        Attendance attendance =
                AttendanceMapper.toEntity(
                        request,
                        employee);

        Attendance savedAttendance =
                attendanceRepository.save(attendance);

        auditLogService.saveLog(
                "CREATE",
                "ATTENDANCE",
                "Marked Attendance for Employee : "
                        + employee.getEmployeeCode()
                        + " - "
                        + employee.getFirstName(),
                "SYSTEM");

        return AttendanceMapper.toResponseDTO(savedAttendance);
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponseDTO> getAllAttendance() {

        List<Attendance> attendanceList;

        if (SecurityUtils.isSuperAdmin()) {

            attendanceList =
                    attendanceRepository.findAll();

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            attendanceList =
                    attendanceRepository
                            .findByEmployeeDepartmentCompanyId(
                                    companyId);
        }

        return attendanceList
                .stream()
                .map(AttendanceMapper::toResponseDTO)
                .toList();
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponseDTO getAttendanceById(
            Long id) {

        Attendance attendance =
                getAttendanceAndValidateAccess(id);

        return AttendanceMapper.toResponseDTO(
                attendance);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    public AttendanceResponseDTO updateAttendance(
            Long id,
            AttendanceRequestDTO request) {

        Attendance attendance =
                getAttendanceAndValidateAccess(id);

        /*
         * Validate requested employee as well.
         *
         * This prevents a Company A user from changing
         * an attendance record to a Company B employee.
         */
        Employee employee =
                getEmployeeAndValidateAccess(
                        request.getEmployeeId());

        AttendanceMapper.updateEntity(
                attendance,
                request,
                employee);

        Attendance updatedAttendance =
                attendanceRepository.save(attendance);

        auditLogService.saveLog(
                "UPDATE",
                "ATTENDANCE",
                "Updated Attendance for Employee : "
                        + employee.getEmployeeCode()
                        + " - "
                        + employee.getFirstName(),
                "SYSTEM");

        return AttendanceMapper.toResponseDTO(updatedAttendance);
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public void deleteAttendance(Long id) {

        Attendance attendance =
                getAttendanceAndValidateAccess(id);

        attendanceRepository.delete(attendance);

        auditLogService.saveLog(
                "DELETE",
                "ATTENDANCE",
                "Deleted Attendance for Employee : "
                        + attendance.getEmployee().getEmployeeCode()
                        + " - "
                        + attendance.getEmployee().getFirstName(),
                "SYSTEM");
    }

    // =========================================================
    // GET BY EMPLOYEE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponseDTO> getAttendanceByEmployee(
            Long employeeId) {

        /*
         * Validates that requested employee belongs
         * to current user's company.
         */
        getEmployeeAndValidateAccess(employeeId);

        List<Attendance> attendanceList;

        if (SecurityUtils.isSuperAdmin()) {

            attendanceList =
                    attendanceRepository
                            .findByEmployeeEmployeeId(
                                    employeeId);

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            attendanceList =
                    attendanceRepository
                            .findByEmployeeEmployeeIdAndEmployeeDepartmentCompanyId(
                                    employeeId,
                                    companyId);
        }

        return attendanceList
                .stream()
                .map(AttendanceMapper::toResponseDTO)
                .toList();
    }

    // =========================================================
    // GET BY DATE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponseDTO> getAttendanceByDate(
            LocalDate date) {

        List<Attendance> attendanceList;

        if (SecurityUtils.isSuperAdmin()) {

            attendanceList =
                    attendanceRepository
                            .findByAttendanceDate(date);

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            attendanceList =
                    attendanceRepository
                            .findByAttendanceDateAndEmployeeDepartmentCompanyId(
                                    date,
                                    companyId);
        }

        return attendanceList
                .stream()
                .map(AttendanceMapper::toResponseDTO)
                .toList();
    }

    // =========================================================
    // CHECK IN
    // =========================================================

    @Override
    public AttendanceResponseDTO checkIn(
            Long employeeId) {

        /*
         * Tenant security is ready.
         *
         * Actual check-in business logic
         * will be implemented separately.
         */
        getEmployeeAndValidateAccess(employeeId);

        throw new UnsupportedOperationException(
                "Check-in logic not implemented yet");
    }

    // =========================================================
    // CHECK OUT
    // =========================================================

    @Override
    public AttendanceResponseDTO checkOut(
            Long employeeId) {

        getEmployeeAndValidateAccess(employeeId);

        throw new UnsupportedOperationException(
                "Check-out logic not implemented yet");
    }

    // =========================================================
    // GET ATTENDANCE + VALIDATE COMPANY
    // =========================================================

    private Attendance getAttendanceAndValidateAccess(
            Long attendanceId) {

        Attendance attendance =
                attendanceRepository
                        .findById(attendanceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance Not Found"));

        validateAttendanceAccess(attendance);

        return attendance;
    }

    // =========================================================
    // VALIDATE ATTENDANCE COMPANY
    // =========================================================

    private void validateAttendanceAccess(
            Attendance attendance) {

        if (SecurityUtils.isSuperAdmin()) {
            return;
        }

        Long currentCompanyId =
                getRequiredCurrentCompanyId();

        if (attendance.getEmployee() == null ||
                attendance.getEmployee()
                        .getDepartment() == null ||
                attendance.getEmployee()
                        .getDepartment()
                        .getCompany() == null ||
                attendance.getEmployee()
                        .getDepartment()
                        .getCompany()
                        .getId() == null) {

            throw new AccessDeniedException(
                    "Attendance company information not found");
        }

        Long attendanceCompanyId =
                attendance.getEmployee()
                        .getDepartment()
                        .getCompany()
                        .getId();

        if (!currentCompanyId.equals(
                attendanceCompanyId)) {

            throw new AccessDeniedException(
                    "Access Denied: Attendance belongs to another company");
        }
    }

    // =========================================================
    // GET EMPLOYEE + VALIDATE COMPANY
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
         * belonging to any company.
         */
        if (SecurityUtils.isSuperAdmin()) {
            return employee;
        }

        Long currentCompanyId =
                getRequiredCurrentCompanyId();

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
}
