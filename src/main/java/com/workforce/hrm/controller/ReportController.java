package com.workforce.hrm.controller;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.response.AttendanceResponseDTO;
import com.workforce.hrm.dto.response.DepartmentResponseDTO;
import com.workforce.hrm.dto.response.EmployeeResponseDTO;
import com.workforce.hrm.dto.response.LeaveResponseDTO;
import com.workforce.hrm.dto.response.PayrollResponseDTO;
import com.workforce.hrm.dto.response.CandidateResponse;
import com.workforce.hrm.dto.response.PerformanceReviewResponse;
import com.workforce.hrm.enums.AttendanceStatus;
import com.workforce.hrm.enums.DepartmentStatus;
import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.enums.LeaveStatus;
import com.workforce.hrm.enums.LeaveType;
import com.workforce.hrm.enums.PayrollStatus;
import com.workforce.hrm.service.AttendanceService;
import com.workforce.hrm.service.DepartmentService;
import com.workforce.hrm.service.EmployeeService;
import com.workforce.hrm.service.LeaveService;
import com.workforce.hrm.service.PayrollService;
import com.workforce.hrm.service.PerformanceReviewService;
import com.workforce.hrm.service.RecruitmentService;
import com.workforce.hrm.security.SecurityUtils;

/**
 * Read-only reporting facade. It deliberately composes existing tenant-aware
 * domain services so exports and dashboard links use the same authorization
 * and data contracts as the primary modules.
 */
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final EmployeeService employeeService;
    private final AttendanceService attendanceService;
    private final LeaveService leaveService;
    private final PayrollService payrollService;
    private final DepartmentService departmentService;
    private final RecruitmentService recruitmentService;
    private final PerformanceReviewService performanceReviewService;

    public ReportController(EmployeeService employeeService,
                            AttendanceService attendanceService,
                            LeaveService leaveService,
                            PayrollService payrollService,
                            DepartmentService departmentService,
                            RecruitmentService recruitmentService,
                            PerformanceReviewService performanceReviewService) {
        this.employeeService = employeeService;
        this.attendanceService = attendanceService;
        this.leaveService = leaveService;
        this.payrollService = payrollService;
        this.departmentService = departmentService;
        this.recruitmentService = recruitmentService;
        this.performanceReviewService = performanceReviewService;
    }

    @GetMapping("/employees")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<Map<String, Object>> employees(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "20") int size,
                                               @RequestParam(required = false) String search,
                                               @RequestParam(required = false) Long departmentId,
                                               @RequestParam(required = false) Long designationId,
                                               @RequestParam(required = false) String status,
                                               @RequestParam(required = false) LocalDate fromDate,
                                               @RequestParam(required = false) LocalDate toDate) {
        Page<EmployeeResponseDTO> result = employeeService.getEmployeesForReport(search,
                parse(status, EmployeeStatus.class), departmentId, designationId, fromDate, toDate,
                pageRequest(page, size));
        return result.map(this::employeeRow);
    }

    @GetMapping("/attendance")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<Map<String, Object>> attendance(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "20") int size,
                                                @RequestParam(required = false) Long employeeId,
                                                @RequestParam(required = false) Long departmentId,
                                                @RequestParam(required = false) String status,
                                                @RequestParam(required = false) LocalDate fromDate,
                                                @RequestParam(required = false) LocalDate toDate) {
        Page<AttendanceResponseDTO> result = attendanceService.getAttendanceForDateRange(fromDate,
                toDate, employeeId, departmentId, parse(status, AttendanceStatus.class), null,
                pageRequest(page, size));
        return result.map(this::attendanceRow);
    }

    @GetMapping("/leave")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<Map<String, Object>> leave(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size,
                                           @RequestParam(required = false) Long employeeId,
                                           @RequestParam(required = false) Long departmentId,
                                           @RequestParam(required = false) String leaveType,
                                           @RequestParam(required = false) String status,
                                           @RequestParam(required = false) LocalDate fromDate,
                                           @RequestParam(required = false) LocalDate toDate) {
        Page<LeaveResponseDTO> result = leaveService.getLeavesForReport(employeeId, departmentId,
                parse(leaveType, LeaveType.class), parse(status, LeaveStatus.class), null, fromDate,
                toDate, pageRequest(page, size));
        return result.map(this::leaveRow);
    }

    @GetMapping("/payroll")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR')")
    public Page<Map<String, Object>> payroll(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "20") int size,
                                             @RequestParam(required = false) Long employeeId,
                                             @RequestParam(required = false) Long departmentId,
                                             @RequestParam(required = false) String status,
                                             @RequestParam(required = false) String month,
                                             @RequestParam(required = false) Integer year) {
        return payrollService.getPayrollsForReport(employeeId, departmentId,
                parse(status, PayrollStatus.class), month, year, pageRequest(page, size))
                .map(this::payrollRow);
    }

    @GetMapping("/departments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<Map<String, Object>> departments(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "20") int size,
                                                 @RequestParam(required = false) String search,
                                                 @RequestParam(required = false) String status) {
        java.util.stream.Stream<DepartmentResponseDTO> stream = departmentService.getAllDepartments().stream();
        if (search != null && !search.isBlank()) {
            String needle = search.toLowerCase(Locale.ROOT);
            stream = stream.filter(row -> row.getDepartmentName().toLowerCase(Locale.ROOT).contains(needle)
                    || row.getDepartmentCode().toLowerCase(Locale.ROOT).contains(needle));
        }
        DepartmentStatus departmentStatus = parse(status, DepartmentStatus.class);
        if (departmentStatus != null) stream = stream.filter(row -> departmentStatus == row.getStatus());
        List<EmployeeResponseDTO> employees = employeeService.getAllEmployees();
        return page(stream.map(row -> departmentRow(row, employees)).toList(), page, size);
    }

    @GetMapping("/recruitment")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<Map<String, Object>> recruitment(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "20") int size,
                                                  @RequestParam(required = false) String search,
                                                  @RequestParam(required = false) String status,
                                                  @RequestParam(required = false) LocalDate fromDate,
                                                  @RequestParam(required = false) LocalDate toDate) {
        return recruitmentService.getCandidates(search, status, fromDate, toDate,
                pageRequest(page, size)).map(this::recruitmentRow);
    }

    @GetMapping("/performance")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<Map<String, Object>> performance(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "20") int size,
                                                 @RequestParam(required = false) String search,
                                                 @RequestParam(required = false) Long employeeId,
                                                 @RequestParam(required = false) Long departmentId,
                                                 @RequestParam(required = false) String status,
                                                 @RequestParam(required = false) LocalDate fromDate,
                                                 @RequestParam(required = false) LocalDate toDate) {
        return performanceReviewService.getReviews(employeeId, departmentId, status, search,
                fromDate, toDate, pageRequest(page, size)).map(this::performanceRow);
    }

    @GetMapping("/{reportType}/export")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public ResponseEntity<byte[]> export(@PathVariable String reportType,
                                         @RequestParam(defaultValue = "csv") String format,
                                         @RequestParam(required = false) String search,
                                         @RequestParam(required = false) Long employeeId,
                                         @RequestParam(required = false) Long departmentId,
                                         @RequestParam(required = false) Long designationId,
                                         @RequestParam(required = false) String status,
                                         @RequestParam(required = false) String leaveType,
                                         @RequestParam(required = false) String month,
                                         @RequestParam(required = false) Integer year,
                                         @RequestParam(required = false) LocalDate fromDate,
                                         @RequestParam(required = false) LocalDate toDate) {
        if (!"csv".equalsIgnoreCase(format)) {
            throw new IllegalArgumentException("Only CSV export is currently supported");
        }
        assertExportAccess(reportType);
        List<Map<String, Object>> rows = switch (reportType.toLowerCase(Locale.ROOT)) {
            case "employees" -> employees(0, 10_000, search, departmentId, designationId, status, fromDate, toDate).getContent();
            case "attendance" -> attendance(0, 10_000, employeeId, departmentId, status, fromDate, toDate).getContent();
            case "leave" -> leave(0, 10_000, employeeId, departmentId, leaveType, status, fromDate, toDate).getContent();
            case "payroll" -> payroll(0, 10_000, employeeId, departmentId, status, month, year).getContent();
            case "departments" -> departments(0, 10_000, search, status).getContent();
            case "recruitment" -> recruitment(0, 10_000, search, status, fromDate, toDate).getContent();
            case "performance" -> performance(0, 10_000, search, employeeId, departmentId, status, fromDate, toDate).getContent();
            default -> throw new IllegalArgumentException("Unsupported report type");
        };
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + reportType + "-report.csv")
                .body(toCsv(rows).getBytes(StandardCharsets.UTF_8));
    }

    private Map<String, Object> employeeRow(EmployeeResponseDTO row) {
        return map("employeeId", row.getEmployeeId(), "employeeCode", value(row.getEmployeeCode()),
                "employeeName", fullName(row.getFirstName(), row.getLastName()), "email", value(row.getEmail()),
                "departmentName", value(row.getDepartmentName()), "designationName", value(row.getDesignationName()),
                "joiningDate", row.getJoiningDate(), "status", value(row.getStatus()));
    }

    private Map<String, Object> attendanceRow(AttendanceResponseDTO row) {
        return map("attendanceId", row.getAttendanceId(), "employeeCode", value(row.getEmployeeCode()),
                "employeeName", value(row.getEmployeeName()), "departmentName", value(row.getDepartmentName()),
                "attendanceDate", row.getAttendanceDate(), "checkInTime", row.getCheckInTime(),
                "checkOutTime", row.getCheckOutTime(), "workingHours", row.getWorkingHours(),
                "status", row.getStatus() == null ? "UNKNOWN" : row.getStatus().name());
    }

    private Map<String, Object> leaveRow(LeaveResponseDTO row) {
        return map("leaveId", row.getLeaveId(), "employeeId", row.getEmployeeId(), "employeeName", value(row.getEmployeeName()),
                "leaveType", row.getLeaveType() == null ? "" : row.getLeaveType().name(), "startDate", row.getStartDate(),
                "endDate", row.getEndDate(), "numberOfDays", days(row.getStartDate(), row.getEndDate()),
                "status", row.getStatus() == null ? "PENDING" : row.getStatus().name());
    }

    private Map<String, Object> payrollRow(PayrollResponseDTO row) {
        return map("payrollId", row.getPayrollId(), "employeeId", row.getEmployeeId(), "employeeCode", value(row.getEmployeeCode()),
                "employeeName", value(row.getEmployeeName()), "departmentName", value(row.getDepartmentName()), "month", value(row.getMonth()),
                "year", row.getYear(), "grossSalary", value(row.getGrossSalary()), "deductions", value(row.getDeductions()),
                "netSalary", value(row.getNetSalary()),
                "status", row.getPayrollStatus() == null ? "GENERATED" : row.getPayrollStatus().name());
    }

    private Map<String, Object> recruitmentRow(CandidateResponse row) {
        return map("candidateId", row.candidateId(), "candidateName", value(row.fullName()),
                "email", value(row.email()), "experience", value(row.experience()),
                "currentCompany", value(row.currentCompany()), "appliedAt", row.createdAt(),
                "status", row.status() == null ? "APPLIED" : row.status().name());
    }

    private Map<String, Object> performanceRow(PerformanceReviewResponse row) {
        return map("performanceReviewId", row.performanceReviewId(), "employeeId", row.employeeId(),
                "employeeCode", value(row.employeeCode()), "employeeName", value(row.employeeName()),
                "departmentName", value(row.departmentName()), "cycleName", value(row.cycleName()),
                "reviewDate", row.reviewDate(), "rating", value(row.rating()),
                "status", value(row.status()));
    }

    private Map<String, Object> departmentRow(DepartmentResponseDTO row,
                                               List<EmployeeResponseDTO> employees) {
        long employeeCount = employees.stream().filter(employee -> row.getDepartmentId().equals(employee.getDepartmentId())).count();
        long activeEmployees = employees.stream().filter(employee -> row.getDepartmentId().equals(employee.getDepartmentId()))
                .filter(employee -> EmployeeStatus.ACTIVE.name().equalsIgnoreCase(employee.getStatus())).count();
        return map("departmentId", row.getDepartmentId(), "departmentName", value(row.getDepartmentName()),
                "departmentCode", value(row.getDepartmentCode()), "employeeCount", employeeCount,
                "activeEmployees", activeEmployees, "inactiveEmployees", employeeCount - activeEmployees,
                "status", row.getStatus() == null ? "ACTIVE" : row.getStatus().name());
    }

    private <T> Page<Map<String, Object>> page(List<Map<String, Object>> data, int page, int size) {
        Pageable pageable = pageRequest(page, size);
        int start = Math.min((int) pageable.getOffset(), data.size());
        int end = Math.min(start + pageable.getPageSize(), data.size());
        return new PageImpl<>(new ArrayList<>(data.subList(start, end)), pageable, data.size());
    }

    private Pageable pageRequest(int page, int size) {
        return PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 10_000));
    }

    private String toCsv(List<Map<String, Object>> rows) {
        if (rows.isEmpty()) return "";
        List<String> columns = new ArrayList<>(rows.getFirst().keySet());
        StringBuilder csv = new StringBuilder(String.join(",", columns)).append('\n');
        for (Map<String, Object> row : rows) {
            for (int index = 0; index < columns.size(); index++) {
                if (index > 0) csv.append(',');
                String value = String.valueOf(row.getOrDefault(columns.get(index), "")).replace("\"", "\"\"");
                csv.append('"').append(value).append('"');
            }
            csv.append('\n');
        }
        return csv.toString();
    }

    private void assertExportAccess(String reportType) {
        if ("payroll".equalsIgnoreCase(reportType)
                && !List.of("SUPER_ADMIN", "COMPANY_ADMIN", "HR").contains(SecurityUtils.getCurrentRole())) {
            throw new org.springframework.security.access.AccessDeniedException("You are not allowed to export payroll reports");
        }
    }

    private long days(LocalDate start, LocalDate end) { return start == null || end == null ? 0 : end.toEpochDay() - start.toEpochDay() + 1; }
    private String fullName(String first, String last) { return (value(first) + " " + value(last)).trim(); }
    private String value(String value) { return value == null ? "" : value; }
    private Number value(Number value) { return value == null ? BigDecimal.ZERO : value; }

    private Map<String, Object> map(Object... values) {
        Map<String, Object> result = new java.util.LinkedHashMap<>();
        for (int index = 0; index < values.length; index += 2) {
            result.put((String) values[index], values[index + 1]);
        }
        return result;
    }

    private <T extends Enum<T>> T parse(String value, Class<T> type) {
        if (value == null || value.isBlank()) return null;
        try { return Enum.valueOf(type, value.trim().toUpperCase(Locale.ROOT)); }
        catch (IllegalArgumentException exception) { throw new IllegalArgumentException("Unsupported " + type.getSimpleName() + ": " + value); }
    }
}
