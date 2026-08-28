package com.workforce.hrm.service.impl;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.AttendanceRequestDTO;
import com.workforce.hrm.dto.response.AttendanceResponseDTO;
import com.workforce.hrm.dto.response.AttendanceSummaryDTO;
import com.workforce.hrm.entity.Attendance;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.enums.AttendanceStatus;
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

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository,
            EmployeeRepository employeeRepository,
            AuditLogService auditLogService) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    public AttendanceResponseDTO createAttendance(AttendanceRequestDTO request) {
        Employee employee = getEmployeeAndValidateAccess(request.getEmployeeId());
        Attendance attendance = AttendanceMapper.toEntity(request, employee);
        Attendance saved = attendanceRepository.save(attendance);
        audit("CREATE", saved);
        return AttendanceMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceResponseDTO> getAttendance(LocalDate date, Long employeeId,
            Long departmentId, AttendanceStatus status, String search, Pageable pageable) {
        Long effectiveEmployeeId = employeeId;
        if (isEmployeeRole()) {
            Long ownEmployeeId = getCurrentEmployee().getEmployeeId();
            if (employeeId != null && !ownEmployeeId.equals(employeeId)) {
                throw new AccessDeniedException("Employees can only view their own attendance");
            }
            effectiveEmployeeId = ownEmployeeId;
        }
        Long companyId = SecurityUtils.isSuperAdmin() ? null : requiredCompanyId();
        Long effectiveDepartmentId = resolveDepartmentScope(departmentId);
        return attendanceRepository.findWorkspaceAttendance(companyId, effectiveEmployeeId,
                effectiveDepartmentId, date, status, normalizeSearch(search), pageable)
                .map(AttendanceMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceResponseDTO> getAttendanceForDateRange(LocalDate fromDate,
            LocalDate toDate, Long employeeId, Long departmentId, AttendanceStatus status,
            String search, Pageable pageable) {
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new IllegalArgumentException("From date cannot be after to date");
        }
        Long effectiveEmployeeId = employeeId;
        if (isEmployeeRole()) {
            Long ownEmployeeId = getCurrentEmployee().getEmployeeId();
            if (employeeId != null && !ownEmployeeId.equals(employeeId)) {
                throw new AccessDeniedException("Employees can only view their own attendance");
            }
            effectiveEmployeeId = ownEmployeeId;
        }
        Long companyId = SecurityUtils.isSuperAdmin() ? null : requiredCompanyId();
        Long effectiveDepartmentId = resolveDepartmentScope(departmentId);
        return attendanceRepository.findWorkspaceAttendanceInDateRange(companyId,
                effectiveEmployeeId, effectiveDepartmentId, fromDate, toDate, status,
                normalizeSearch(search), pageable).map(AttendanceMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceSummaryDTO getAttendanceSummary(LocalDate requestedDate) {
        LocalDate date = requestedDate == null ? LocalDate.now() : requestedDate;
        List<AttendanceResponseDTO> records = getAttendance(date, null, null, null,
                null, Pageable.unpaged()).getContent();
        long present = count(records, AttendanceStatus.PRESENT);
        long absent = count(records, AttendanceStatus.ABSENT);
        // The persisted AttendanceStatus enum does not model late arrival yet.
        long late = 0L;
        long halfDay = count(records, AttendanceStatus.HALF_DAY);
        long onLeave = count(records, AttendanceStatus.ON_LEAVE);
        return new AttendanceSummaryDTO(date, records.size(), present, absent, late,
                halfDay, onLeave);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponseDTO> getAllAttendance() {
        return getAttendance(null, null, null, null, null, Pageable.unpaged()).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponseDTO getAttendanceById(Long id) {
        return AttendanceMapper.toResponseDTO(getAttendanceAndValidateAccess(id));
    }

    @Override
    public AttendanceResponseDTO updateAttendance(Long id, AttendanceRequestDTO request) {
        Attendance attendance = getAttendanceAndValidateAccess(id);
        Employee employee = getEmployeeAndValidateAccess(request.getEmployeeId());
        AttendanceMapper.updateEntity(attendance, request, employee);
        Attendance saved = attendanceRepository.save(attendance);
        audit("UPDATE", saved);
        return AttendanceMapper.toResponseDTO(saved);
    }

    @Override
    public void deleteAttendance(Long id) {
        Attendance attendance = getAttendanceAndValidateAccess(id);
        attendanceRepository.delete(attendance);
        audit("DELETE", attendance);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponseDTO> getAttendanceByEmployee(Long employeeId) {
        getEmployeeAndValidateAccess(employeeId);
        return getAttendance(null, employeeId, null, null, null, Pageable.unpaged()).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponseDTO> getAttendanceByDate(LocalDate date) {
        return getAttendance(date, null, null, null, null, Pageable.unpaged()).getContent();
    }

    @Override
    public AttendanceResponseDTO checkIn(Long employeeId) {
        Employee employee = getEmployeeAndValidateAccess(employeeId);
        LocalDate today = LocalDate.now();
        if (attendanceRepository.findByEmployeeEmployeeIdAndAttendanceDate(
                employee.getEmployeeId(), today).isPresent()) {
            throw new IllegalStateException("Attendance has already been recorded for today");
        }
        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setAttendanceDate(today);
        attendance.setCheckInTime(LocalTime.now().withNano(0));
        attendance.setWorkingHours(0D);
        attendance.setOvertimeHours(0D);
        attendance.setStatus(AttendanceStatus.PRESENT);
        Attendance saved = attendanceRepository.save(attendance);
        audit("CHECK_IN", saved);
        return AttendanceMapper.toResponseDTO(saved);
    }

    @Override
    public AttendanceResponseDTO checkOut(Long employeeId) {
        Employee employee = getEmployeeAndValidateAccess(employeeId);
        Attendance attendance = attendanceRepository
                .findByEmployeeEmployeeIdAndAttendanceDate(employee.getEmployeeId(), LocalDate.now())
                .orElseThrow(() -> new IllegalStateException("Check in before checking out"));
        if (attendance.getCheckOutTime() != null) {
            throw new IllegalStateException("You have already checked out today");
        }
        LocalTime checkOut = LocalTime.now().withNano(0);
        attendance.setCheckOutTime(checkOut);
        attendance.setWorkingHours(calculateWorkingHours(attendance.getCheckInTime(), checkOut));
        Attendance saved = attendanceRepository.save(attendance);
        audit("CHECK_OUT", saved);
        return AttendanceMapper.toResponseDTO(saved);
    }

    @Override
    public AttendanceResponseDTO checkInCurrentUser() {
        return checkIn(getCurrentEmployee().getEmployeeId());
    }

    @Override
    public AttendanceResponseDTO checkOutCurrentUser() {
        return checkOut(getCurrentEmployee().getEmployeeId());
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponseDTO getCurrentUserTodayAttendance() {
        Employee employee = getCurrentEmployee();
        return attendanceRepository
                .findByEmployeeEmployeeIdAndAttendanceDate(employee.getEmployeeId(), LocalDate.now())
                .map(AttendanceMapper::toResponseDTO)
                .orElseThrow(() -> new IllegalArgumentException("No attendance record exists for today"));
    }

    private Attendance getAttendanceAndValidateAccess(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Attendance not found"));
        getEmployeeAndValidateAccess(attendance.getEmployee().getEmployeeId());
        return attendance;
    }

    private Employee getEmployeeAndValidateAccess(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        if (!SecurityUtils.isSuperAdmin()) {
            Long companyId = requiredCompanyId();
            if (employee.getCompany() == null || !companyId.equals(employee.getCompany().getId())) {
                throw new AccessDeniedException("Employee belongs to another company");
            }
        }
        if (isEmployeeRole() && !getCurrentEmployee().getEmployeeId().equals(employee.getEmployeeId())) {
            throw new AccessDeniedException("Employees can only access their own attendance");
        }
        if (isManagerRole() && (employee.getDepartment() == null
                || !requiredManagerDepartmentId().equals(employee.getDepartment().getDepartmentId()))) {
            throw new AccessDeniedException("Managers can only access their own team attendance");
        }
        return employee;
    }

    private Employee getCurrentEmployee() {
        String email = SecurityUtils.getCurrentUserEmail();
        if (email == null || email.isBlank()) {
            throw new AccessDeniedException("Authenticated employee profile is required");
        }
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException(
                        "No employee profile is linked to the current user"));
    }

    private boolean isEmployeeRole() {
        return "EMPLOYEE".equalsIgnoreCase(SecurityUtils.getCurrentRole());
    }

    private boolean isManagerRole() {
        return "MANAGER".equalsIgnoreCase(SecurityUtils.getCurrentRole());
    }

    private Long resolveDepartmentScope(Long requestedDepartmentId) {
        if (!isManagerRole()) {
            return requestedDepartmentId;
        }
        Long managerDepartmentId = requiredManagerDepartmentId();
        if (requestedDepartmentId != null && !managerDepartmentId.equals(requestedDepartmentId)) {
            throw new AccessDeniedException("Managers can only access their own team attendance");
        }
        return managerDepartmentId;
    }

    private Long requiredManagerDepartmentId() {
        Employee manager = getCurrentEmployee();
        if (manager.getDepartment() == null) {
            throw new AccessDeniedException("The manager has no authorised team scope");
        }
        return manager.getDepartment().getDepartmentId();
    }

    private Long requiredCompanyId() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        if (companyId == null) {
            throw new AccessDeniedException("No company assigned to the current user");
        }
        return companyId;
    }

    private long count(List<AttendanceResponseDTO> records, AttendanceStatus status) {
        return records.stream().filter(record -> status.equals(record.getStatus())).count();
    }

    private String normalizeSearch(String search) {
        return search == null || search.isBlank() ? null : search.trim();
    }

    private double calculateWorkingHours(LocalTime checkIn, LocalTime checkOut) {
        if (checkIn == null || checkOut == null) {
            return 0D;
        }
        long minutes = Duration.between(checkIn, checkOut).toMinutes();
        return Math.round((minutes / 60D) * 100D) / 100D;
    }

    private void audit(String action, Attendance attendance) {
        auditLogService.saveLog(action, "ATTENDANCE",
                action + " attendance for " + attendance.getEmployee().getEmployeeCode(), "SYSTEM");
    }
}
