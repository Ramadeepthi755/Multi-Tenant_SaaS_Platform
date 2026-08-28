package com.workforce.hrm.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.response.ChartDataDTO;
import com.workforce.hrm.dto.response.DashboardActivityDTO;
import com.workforce.hrm.dto.response.DashboardAttentionDTO;
import com.workforce.hrm.dto.response.DashboardItemDTO;
import com.workforce.hrm.dto.response.RoleDashboardResponseDTO;
import com.workforce.hrm.entity.Attendance;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Leave;
import com.workforce.hrm.entity.Payroll;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.enums.AttendanceStatus;
import com.workforce.hrm.enums.CandidateStatus;
import com.workforce.hrm.enums.CompanyStatus;
import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.enums.LeaveStatus;
import com.workforce.hrm.enums.NotificationStatus;
import com.workforce.hrm.repository.AttendanceRepository;
import com.workforce.hrm.repository.AuditLogRepository;
import com.workforce.hrm.repository.CandidateRepository;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.DesignationRepository;
import com.workforce.hrm.repository.DocumentRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.HolidayRepository;
import com.workforce.hrm.repository.LeaveRepository;
import com.workforce.hrm.repository.NotificationRepository;
import com.workforce.hrm.repository.PayrollRepository;
import com.workforce.hrm.repository.PerformanceReviewRepository;
import com.workforce.hrm.repository.UserRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.DashboardService;

/**
 * Builds a dashboard from authenticated server-side scope. This API accepts no
 * company or employee id, preventing browser-provided tenant selection.
 */
@Service
public class DashboardServiceImpl implements DashboardService {

    private static final Pageable DASHBOARD_PAGE =
            PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "createdAt"));
    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final PayrollRepository payrollRepository;
    private final HolidayRepository holidayRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final CandidateRepository candidateRepository;
    private final DocumentRepository documentRepository;
    private final NotificationRepository notificationRepository;
    private final PerformanceReviewRepository performanceReviewRepository;

    public DashboardServiceImpl(EmployeeRepository employeeRepository,
                                DepartmentRepository departmentRepository,
                                DesignationRepository designationRepository,
                                AttendanceRepository attendanceRepository,
                                LeaveRepository leaveRepository,
                                PayrollRepository payrollRepository,
                                HolidayRepository holidayRepository,
                                CompanyRepository companyRepository,
                                UserRepository userRepository,
                                AuditLogRepository auditLogRepository,
                                CandidateRepository candidateRepository,
                                DocumentRepository documentRepository,
                                NotificationRepository notificationRepository,
                                PerformanceReviewRepository performanceReviewRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.payrollRepository = payrollRepository;
        this.holidayRepository = holidayRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.candidateRepository = candidateRepository;
        this.documentRepository = documentRepository;
        this.notificationRepository = notificationRepository;
        this.performanceReviewRepository = performanceReviewRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public RoleDashboardResponseDTO getDashboard() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        String role = SecurityUtils.getCurrentRole();
        if (currentUserId == null || role == null) {
            throw new AccessDeniedException("An authenticated user with a role is required");
        }

        // The security principal is intentionally detached after JWT
        // authentication. Reload it in this read-only transaction before
        // following its lazy company association.
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AccessDeniedException("The authenticated user no longer exists"));

        return switch (role) {
            case "SUPER_ADMIN" -> superAdminDashboard();
            case "COMPANY_ADMIN" -> companyAdminDashboard(requiredCompany(user));
            case "HR" -> hrDashboard(requiredCompany(user));
            case "MANAGER" -> managerDashboard(requiredCompany(user), currentEmployee(user));
            case "EMPLOYEE" -> employeeDashboard(requiredCompany(user), currentEmployee(user), user);
            default -> throw new AccessDeniedException("Unsupported dashboard role");
        };
    }

    private RoleDashboardResponseDTO superAdminDashboard() {
        RoleDashboardResponseDTO response = base("SUPER_ADMIN", "Platform-wide workspace", null);
        put(response, "totalCompanies", companyRepository.count());
        put(response, "activeCompanies", companyRepository.countByStatus(CompanyStatus.ACTIVE));
        put(response, "inactiveCompanies", companyRepository.countByStatus(CompanyStatus.INACTIVE));
        put(response, "totalUsers", userRepository.count());
        put(response, "totalEmployees", employeeRepository.count());
        put(response, "activeEmployees", employeeRepository.countByStatus(EmployeeStatus.ACTIVE));
        put(response, "todayPresent", countAttendance(null, null, AttendanceStatus.PRESENT));
        put(response, "pendingLeaves", leaveRepository.countByStatus(LeaveStatus.PENDING));
        response.getCharts().put("usersByRole", chart(userRepository.countUsersByRole()));
        response.getCharts().put("workforceByCompany", chart(employeeRepository.companyWiseEmployees()));
        response.getCharts().put("employeeGrowth", monthChart(employeeRepository.employeeGrowthTrend()));
        response.setActivities(auditLogRepository.findAll(DASHBOARD_PAGE).getContent().stream().map(this::activity).toList());
        response.setItems(companyRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id"))).stream()
                .map(company -> new DashboardItemDTO(company.getCompanyName(), company.getCompanyCode(), "/companies",
                        company.getStatus().name())).toList());
        attention(response, "Pending leave requests", response.getMetrics().get("pendingLeaves"), "/reports/leave", "warning");
        attention(response, "Inactive companies", response.getMetrics().get("inactiveCompanies"), "/companies", "info");
        return response;
    }

    private RoleDashboardResponseDTO companyAdminDashboard(Company company) {
        RoleDashboardResponseDTO response = companyBase("COMPANY_ADMIN", company);
        put(response, "departments", departmentRepository.countByCompanyId(company.getId()));
        put(response, "designations", designationRepository.countByDepartmentCompanyId(company.getId()));
        putPayroll(response, company.getId());
        response.getCharts().put("employeeGrowth", monthChart(employeeRepository.employeeGrowthTrendByCompanyId(company.getId())));
        response.getCharts().put("departmentDistribution", chart(employeeRepository.getDepartmentWiseEmployeeCountByCompanyId(company.getId())));
        response.setActivities(companyActivities(company.getId()));
        response.setItems(recentEmployees(company.getId()));
        attention(response, "Pending HR actions", response.getMetrics().get("pendingLeaves"), "/leave", "warning");
        attention(response, "Upcoming holidays", response.getMetrics().get("upcomingHolidays"), "/holidays", "info");
        return response;
    }

    private RoleDashboardResponseDTO hrDashboard(Company company) {
        RoleDashboardResponseDTO response = companyBase("HR", company);
        put(response, "documentCount", documentRepository.findByCompany_Id(company.getId()).size());
        put(response, "newEmployeesThisMonth", value(employeeRepository.countEmployeesJoinedThisMonthByCompanyId(company.getId())));
        put(response, "offboardedThisMonth", value(employeeRepository.countEmployeesResignedThisMonthByCompanyId(company.getId())));
        put(response, "openRecruitment", candidateRepository.countByCompany_IdAndStatus(company.getId(), CandidateStatus.APPLIED)
                + candidateRepository.countByCompany_IdAndStatus(company.getId(), CandidateStatus.SHORTLISTED)
                + candidateRepository.countByCompany_IdAndStatus(company.getId(), CandidateStatus.INTERVIEW_SCHEDULED));
        response.getCharts().put("attendance", attendanceChart(company.getId(), null));
        response.getCharts().put("recruitment", candidateChart(company.getId()));
        response.getCharts().put("departmentDistribution", chart(employeeRepository.getDepartmentWiseEmployeeCountByCompanyId(company.getId())));
        response.setActivities(companyActivities(company.getId()));
        response.setItems(upcomingHolidays(company.getId()));
        attention(response, "Leave approvals waiting", response.getMetrics().get("pendingLeaves"), "/leave", "warning");
        attention(response, "Open recruitment candidates", response.getMetrics().get("openRecruitment"), "/recruitment", "info");
        return response;
    }

    private RoleDashboardResponseDTO managerDashboard(Company company, Employee manager) {
        if (manager.getDepartment() == null) {
            throw new AccessDeniedException("A manager must have a department to access the team dashboard");
        }
        Long departmentId = manager.getDepartment().getDepartmentId();
        RoleDashboardResponseDTO response = base("MANAGER", manager.getDepartment().getDepartmentName(), company.getCompanyName());
        List<Employee> team = employeeRepository.findByDepartmentDepartmentIdAndDepartmentCompanyId(departmentId, company.getId());
        put(response, "teamSize", team.size());
        put(response, "activeTeamMembers", team.stream().filter(employee -> employee.getStatus() == EmployeeStatus.ACTIVE).count());
        put(response, "presentToday", countAttendance(company.getId(), departmentId, AttendanceStatus.PRESENT));
        put(response, "absentToday", countAttendance(company.getId(), departmentId, AttendanceStatus.ABSENT));
        put(response, "pendingLeaves", countLeaves(company.getId(), departmentId, LeaveStatus.PENDING, null, null));
        put(response, "onLeaveToday", countLeaves(company.getId(), departmentId, LeaveStatus.APPROVED, LocalDate.now(), LocalDate.now()));
        put(response, "performanceReviews", performanceReviewRepository.search(company.getId(), null, departmentId,
                null, null, null, null, PageRequest.of(0, 1)).getTotalElements());
        response.getCharts().put("teamAttendance", attendanceChart(company.getId(), departmentId));
        response.setItems(team.stream().filter(employee -> !employee.getEmployeeId().equals(manager.getEmployeeId())).limit(6)
                .map(employee -> new DashboardItemDTO(fullName(employee), employee.getEmployeeCode(), "/employees",
                        employee.getStatus().name())).toList());
        response.setActivities(auditLogRepository.findByUserId(SecurityUtils.getCurrentUserId(), DASHBOARD_PAGE).getContent()
                .stream().map(this::activity).toList());
        attention(response, "Team leave approvals", response.getMetrics().get("pendingLeaves"), "/leave", "warning");
        return response;
    }

    private RoleDashboardResponseDTO employeeDashboard(Company company, Employee employee, User user) {
        RoleDashboardResponseDTO response = base("EMPLOYEE", "Your personal workspace", company.getCompanyName());
        Attendance attendance = attendanceRepository.findByEmployeeEmployeeIdAndAttendanceDate(employee.getEmployeeId(), LocalDate.now()).orElse(null);
        List<Leave> leaves = leaveRepository.findByEmployeeEmployeeIdAndEmployeeDepartmentCompanyId(employee.getEmployeeId(), company.getId());
        List<Payroll> payrolls = payrollRepository.findByEmployeeEmployeeIdAndEmployeeDepartmentCompanyId(employee.getEmployeeId(), company.getId());
        put(response, "documents", documentRepository.findByCompany_IdAndEmployee_EmployeeId(company.getId(), employee.getEmployeeId()).size());
        put(response, "leaveRequests", leaves.size());
        put(response, "pendingLeaveRequests", leaves.stream().filter(leave -> leave.getStatus() == LeaveStatus.PENDING).count());
        put(response, "approvedLeaveDaysThisYear", approvedLeaveDaysThisYear(leaves));
        put(response, "unreadNotifications", notificationRepository.countByUserAndStatus(user, NotificationStatus.UNREAD));
        put(response, "payslips", payrolls.size());
        response.getDetails().put("attendanceStatus", attendance == null || attendance.getStatus() == null ? "No attendance recorded today" : title(attendance.getStatus().name()));
        response.getDetails().put("checkIn", attendance == null || attendance.getCheckInTime() == null ? "—" : attendance.getCheckInTime().toString());
        response.getDetails().put("checkOut", attendance == null || attendance.getCheckOutTime() == null ? "—" : attendance.getCheckOutTime().toString());
        response.getDetails().put("workingHours", attendance == null || attendance.getWorkingHours() == null ? "—" : String.valueOf(attendance.getWorkingHours()));
        payrolls.stream().max(Comparator.comparing(Payroll::getGeneratedDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .ifPresent(payroll -> response.getDetails().put("latestPayroll", payroll.getNetSalary().toPlainString()));
        response.getCharts().put("leaveRequests", leaveStatusChart(leaves));
        response.setItems(upcomingHolidays(company.getId()));
        response.setActivities(notificationRepository.findTop5ByUserOrderByCreatedAtDesc(user).stream()
                .map(notification -> new DashboardActivityDTO(notification.getTitle(), notification.getMessage(),
                        "NOTIFICATIONS", notification.getCreatedAt())).toList());
        attention(response, "Pending leave requests", response.getMetrics().get("pendingLeaveRequests"), "/leave", "warning");
        return response;
    }

    private RoleDashboardResponseDTO companyBase(String role, Company company) {
        RoleDashboardResponseDTO response = base(role, company.getCompanyName(), company.getCompanyName());
        Long companyId = company.getId();
        put(response, "totalEmployees", employeeRepository.countByDepartmentCompanyId(companyId));
        put(response, "activeEmployees", employeeRepository.countByStatusAndDepartmentCompanyId(EmployeeStatus.ACTIVE, companyId));
        put(response, "presentToday", countAttendance(companyId, null, AttendanceStatus.PRESENT));
        put(response, "absentToday", countAttendance(companyId, null, AttendanceStatus.ABSENT));
        put(response, "onLeaveToday", leaveRepository.countTodayLeaveByCompanyId(companyId));
        put(response, "pendingLeaves", leaveRepository.countByStatusAndEmployeeDepartmentCompanyId(LeaveStatus.PENDING, companyId));
        put(response, "upcomingHolidays", holidayRepository.upcomingHolidaysByCompanyId(companyId, PageRequest.of(0, 5)).size());
        return response;
    }

    private RoleDashboardResponseDTO base(String role, String scope, String companyName) {
        RoleDashboardResponseDTO response = new RoleDashboardResponseDTO();
        response.setRole(role);
        response.setScopeLabel(scope);
        response.setCompanyName(companyName);
        response.setGeneratedAt(LocalDateTime.now());
        return response;
    }

    private void putPayroll(RoleDashboardResponseDTO response, Long companyId) {
        BigDecimal payroll = payrollRepository.getCurrentMonthPayrollByCompanyId(
                LocalDate.now().getMonth().name(), LocalDate.now().getYear(), companyId);
        response.getDetails().put("currentMonthPayroll", (payroll == null ? BigDecimal.ZERO : payroll).toPlainString());
    }

    private long countAttendance(Long companyId, Long departmentId, AttendanceStatus status) {
        return attendanceRepository.findWorkspaceAttendance(companyId, null, departmentId, LocalDate.now(), status,
                null, PageRequest.of(0, 1)).getTotalElements();
    }

    private long countLeaves(Long companyId, Long departmentId, LeaveStatus status, LocalDate from, LocalDate to) {
        return leaveRepository.findWorkspaceLeavesForReport(companyId, null, departmentId, null, status,
                from, to, null, PageRequest.of(0, 1)).getTotalElements();
    }

    private List<ChartDataDTO> attendanceChart(Long companyId, Long departmentId) {
        return List.of(new ChartDataDTO("Present", countAttendance(companyId, departmentId, AttendanceStatus.PRESENT)),
                new ChartDataDTO("Absent", countAttendance(companyId, departmentId, AttendanceStatus.ABSENT)),
                new ChartDataDTO("Work from home", countAttendance(companyId, departmentId, AttendanceStatus.WORK_FROM_HOME)),
                new ChartDataDTO("On leave", countAttendance(companyId, departmentId, AttendanceStatus.ON_LEAVE)));
    }

    private List<ChartDataDTO> candidateChart(Long companyId) {
        return List.of(CandidateStatus.APPLIED, CandidateStatus.SHORTLISTED, CandidateStatus.INTERVIEW_SCHEDULED,
                        CandidateStatus.SELECTED, CandidateStatus.JOINED).stream()
                .map(status -> new ChartDataDTO(title(status.name()), candidateRepository.countByCompany_IdAndStatus(companyId, status))).toList();
    }

    private List<ChartDataDTO> leaveStatusChart(List<Leave> leaves) {
        return leaves.stream().collect(Collectors.groupingBy(leave -> leave.getStatus().name(), Collectors.counting()))
                .entrySet().stream().map(entry -> new ChartDataDTO(title(entry.getKey()), entry.getValue())).toList();
    }

    private List<ChartDataDTO> chart(List<Object[]> rows) {
        return rows.stream().map(row -> new ChartDataDTO(String.valueOf(row[0]), value(row[1]))).toList();
    }

    private List<ChartDataDTO> monthChart(List<Object[]> rows) {
        return rows.stream().map(row -> new ChartDataDTO(java.time.Month.of(((Number) row[0]).intValue())
                .getDisplayName(TextStyle.SHORT, Locale.ENGLISH), value(row[1]))).toList();
    }

    private List<DashboardActivityDTO> companyActivities(Long companyId) {
        return auditLogRepository.findByCompanyId(companyId, DASHBOARD_PAGE).getContent().stream().map(this::activity).toList();
    }

    private DashboardActivityDTO activity(com.workforce.hrm.entity.AuditLog log) {
        return new DashboardActivityDTO(title(log.getAction()),
                log.getDetails() == null || log.getDetails().isBlank() ? log.getModule() : log.getDetails(),
                log.getModule(), log.getCreatedAt());
    }

    private List<DashboardItemDTO> recentEmployees(Long companyId) {
        return employeeRepository.findTop5ByDepartmentCompanyIdOrderByJoiningDateDesc(companyId).stream()
                .map(employee -> new DashboardItemDTO(fullName(employee), employee.getEmployeeCode(), "/employees",
                        employee.getStatus() == null ? "UNKNOWN" : employee.getStatus().name())).toList();
    }

    private List<DashboardItemDTO> upcomingHolidays(Long companyId) {
        return holidayRepository.upcomingHolidaysByCompanyId(companyId, PageRequest.of(0, 5)).stream()
                .map(holiday -> new DashboardItemDTO(holiday.getHolidayName(), holiday.getHolidayDate().format(DATE_FORMAT),
                        "/holidays", holiday.getHolidayType())).toList();
    }

    private long approvedLeaveDaysThisYear(List<Leave> leaves) {
        LocalDate start = LocalDate.of(LocalDate.now().getYear(), 1, 1);
        LocalDate end = LocalDate.of(LocalDate.now().getYear(), 12, 31);
        return leaves.stream().filter(leave -> leave.getStatus() == LeaveStatus.APPROVED)
                .mapToLong(leave -> Math.max(0, java.time.temporal.ChronoUnit.DAYS.between(
                        leave.getStartDate().isBefore(start) ? start : leave.getStartDate(),
                        leave.getEndDate().isAfter(end) ? end : leave.getEndDate()) + 1)).sum();
    }

    private Company requiredCompany(User user) {
        if (user == null || user.getCompany() == null || user.getCompany().getId() == null) {
            throw new AccessDeniedException("The current user is not assigned to a company");
        }
        return companyRepository.findById(user.getCompany().getId())
                .orElseThrow(() -> new AccessDeniedException("The current user's company no longer exists"));
    }

    private Employee currentEmployee(User user) {
        Company company = requiredCompany(user);
        return employeeRepository.findByEmail(user.getEmail())
                .filter(employee -> employee.getCompany() != null && employee.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new AccessDeniedException("The current user has no employee profile"));
    }

    private void attention(RoleDashboardResponseDTO response, String title, Long count, String path, String severity) {
        if (count != null && count > 0) {
            response.getAttention().add(new DashboardAttentionDTO(title,
                    count + " item" + (count == 1 ? "" : "s") + " need attention", path, severity));
        }
    }

    private void put(RoleDashboardResponseDTO response, String key, long value) { response.getMetrics().put(key, value); }
    private long value(Object value) { return value instanceof Number number ? number.longValue() : 0L; }
    private String fullName(Employee employee) { return (employee.getFirstName() + " " + (employee.getLastName() == null ? "" : employee.getLastName())).trim(); }
    private String title(String value) {
        return java.util.Arrays.stream(value.toLowerCase(Locale.ENGLISH).split("_"))
                .map(word -> word.isEmpty() ? word : Character.toUpperCase(word.charAt(0)) + word.substring(1))
                .collect(Collectors.joining(" "));
    }
}
