package com.workforce.hrm.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.workforce.hrm.dto.response.ChartDataDTO;
import com.workforce.hrm.dto.response.DashboardResponseDTO;
import com.workforce.hrm.dto.response.RecentEmployeeDTO;
import com.workforce.hrm.dto.response.UpcomingHolidayDTO;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Holiday;
import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.repository.AttendanceRepository;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.DesignationRepository;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.HolidayRepository;
import com.workforce.hrm.repository.LeaveRepository;
import com.workforce.hrm.repository.PayrollRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final PayrollRepository payrollRepository;
    private final HolidayRepository holidayRepository;

    public DashboardServiceImpl(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            DesignationRepository designationRepository,
            AttendanceRepository attendanceRepository,
            LeaveRepository leaveRepository,
            PayrollRepository payrollRepository,
            HolidayRepository holidayRepository) {

        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.payrollRepository = payrollRepository;
        this.holidayRepository = holidayRepository;
    }


    // =========================================================
    // DASHBOARD
    // =========================================================

    @Override
    public DashboardResponseDTO getDashboard() {

        /*
         * SUPER_ADMIN
         *      -> Global dashboard
         *
         * COMPANY_ADMIN / HR / MANAGER / EMPLOYEE
         *      -> Current company dashboard
         */

        if (SecurityUtils.isSuperAdmin()) {

            return getSuperAdminDashboard();
        }

        Long companyId =
                SecurityUtils.getCurrentCompanyId();

        if (companyId == null) {

            throw new RuntimeException(
                    "Company not found for current user");
        }

        return getCompanyDashboard(companyId);
    }


    // =========================================================
    // SUPER ADMIN DASHBOARD
    // GLOBAL DATA
    // =========================================================

    private DashboardResponseDTO getSuperAdminDashboard() {

        DashboardResponseDTO dto =
                new DashboardResponseDTO();

        LocalDate today =
                LocalDate.now();

        Integer currentYear =
                today.getYear();

        String currentMonth =
                today.getMonth().name();


        // -----------------------------------------------------
        // PAYROLL
        // -----------------------------------------------------

        BigDecimal payroll =
                payrollRepository
                        .getCurrentMonthPayroll(
                                currentMonth,
                                currentYear);

        if (payroll == null) {

            payroll = BigDecimal.ZERO;
        }


        // -----------------------------------------------------
        // SUMMARY CARDS
        // -----------------------------------------------------

        dto.setTotalEmployees(
                employeeRepository.count());

        dto.setActiveEmployees(
                employeeRepository
                        .countByStatus(
                                EmployeeStatus.ACTIVE));

        dto.setTotalDepartments(
                departmentRepository.count());

        dto.setTotalDesignations(
                designationRepository.count());

        dto.setTodayAttendance(
                attendanceRepository
                        .countTodayAttendance());

        dto.setTodayLeaves(
                leaveRepository
                        .countTodayLeave());

        dto.setCurrentMonthPayroll(
                payroll);

        dto.setTotalHolidays(
                holidayRepository
                        .totalHolidays());


        // -----------------------------------------------------
        // RECENT EMPLOYEES
        // -----------------------------------------------------

        dto.setRecentEmployees(

                employeeRepository
                        .findTop5ByOrderByJoiningDateDesc()
                        .stream()
                        .map(this::mapRecentEmployee)
                        .collect(Collectors.toList())
        );


        // -----------------------------------------------------
        // UPCOMING HOLIDAYS
        // -----------------------------------------------------

        dto.setUpcomingHolidays(

                holidayRepository
                        .upcomingHolidays(
                                PageRequest.of(0, 5))
                        .stream()
                        .map(this::mapHoliday)
                        .collect(Collectors.toList())
        );


        // -----------------------------------------------------
        // GENDER DISTRIBUTION
        // -----------------------------------------------------

        dto.setGenderDistribution(

                mapChart(
                        employeeRepository
                                .getGenderDistribution())
        );


        // -----------------------------------------------------
        // DEPARTMENT DISTRIBUTION
        // -----------------------------------------------------

        dto.setDepartmentDistribution(

                mapChart(
                        employeeRepository
                                .getDepartmentWiseEmployeeCount())
        );


        // -----------------------------------------------------
        // EMPLOYEE GROWTH
        // -----------------------------------------------------

        dto.setEmployeeGrowth(

                mapMonthChart(
                        employeeRepository
                                .employeeGrowthTrend())
        );


        // -----------------------------------------------------
        // RESIGNATION TREND
        // -----------------------------------------------------

        dto.setResignationTrend(

                mapMonthChart(
                        employeeRepository
                                .resignationTrend())
        );


        // -----------------------------------------------------
        // COMPANY WISE EMPLOYEES
        //
        // Only SUPER_ADMIN should see this.
        // -----------------------------------------------------

        dto.setCompanyWiseEmployees(

                mapChart(
                        employeeRepository
                                .companyWiseEmployees())
        );


        return dto;
    }


    // =========================================================
    // COMPANY DASHBOARD
    // TENANT DATA ONLY
    // =========================================================

    private DashboardResponseDTO getCompanyDashboard(
            Long companyId) {

        DashboardResponseDTO dto =
                new DashboardResponseDTO();

        LocalDate today =
                LocalDate.now();

        Integer currentYear =
                today.getYear();

        String currentMonth =
                today.getMonth().name();


        // -----------------------------------------------------
        // PAYROLL - COMPANY ONLY
        // -----------------------------------------------------

        BigDecimal payroll =
                payrollRepository
                        .getCurrentMonthPayrollByCompanyId(
                                currentMonth,
                                currentYear,
                                companyId);

        if (payroll == null) {

            payroll = BigDecimal.ZERO;
        }


        // -----------------------------------------------------
        // TOTAL EMPLOYEES
        // -----------------------------------------------------

        dto.setTotalEmployees(

                employeeRepository
                        .countByDepartmentCompanyId(
                                companyId)
        );


        // -----------------------------------------------------
        // ACTIVE EMPLOYEES
        // -----------------------------------------------------

        dto.setActiveEmployees(

                employeeRepository
                        .countByStatusAndDepartmentCompanyId(
                                EmployeeStatus.ACTIVE,
                                companyId)
        );


        // -----------------------------------------------------
        // DEPARTMENTS
        // -----------------------------------------------------

        dto.setTotalDepartments(

                departmentRepository
                        .countByCompanyId(
                                companyId)
        );


        // -----------------------------------------------------
        // DESIGNATIONS
        // -----------------------------------------------------

        dto.setTotalDesignations(

                designationRepository
                        .countByDepartmentCompanyId(
                                companyId)
        );


        // -----------------------------------------------------
        // TODAY ATTENDANCE
        // -----------------------------------------------------

        dto.setTodayAttendance(

                attendanceRepository
                        .countTodayAttendanceByCompanyId(
                                companyId)
        );


        // -----------------------------------------------------
        // TODAY LEAVES
        // -----------------------------------------------------

        dto.setTodayLeaves(

                leaveRepository
                        .countTodayLeaveByCompanyId(
                                companyId)
        );


        // -----------------------------------------------------
        // CURRENT MONTH PAYROLL
        // -----------------------------------------------------

        dto.setCurrentMonthPayroll(
                payroll);


        // -----------------------------------------------------
        // HOLIDAYS - COMPANY ONLY
        // -----------------------------------------------------

        dto.setTotalHolidays(

                holidayRepository
                        .totalHolidaysByCompanyId(
                                companyId)
        );


        // -----------------------------------------------------
        // RECENT EMPLOYEES - COMPANY ONLY
        // -----------------------------------------------------

        dto.setRecentEmployees(

                employeeRepository
                        .findTop5ByDepartmentCompanyIdOrderByJoiningDateDesc(
                                companyId)
                        .stream()
                        .map(this::mapRecentEmployee)
                        .collect(Collectors.toList())
        );


        // -----------------------------------------------------
        // UPCOMING HOLIDAYS - COMPANY ONLY
        // -----------------------------------------------------

        dto.setUpcomingHolidays(

                holidayRepository
                        .upcomingHolidaysByCompanyId(
                                companyId,
                                PageRequest.of(0, 5))
                        .stream()
                        .map(this::mapHoliday)
                        .collect(Collectors.toList())
        );


        // -----------------------------------------------------
        // GENDER DISTRIBUTION - COMPANY ONLY
        // -----------------------------------------------------

        dto.setGenderDistribution(

                mapChart(
                        employeeRepository
                                .getGenderDistributionByCompanyId(
                                        companyId))
        );


        // -----------------------------------------------------
        // DEPARTMENT DISTRIBUTION - COMPANY ONLY
        // -----------------------------------------------------

        dto.setDepartmentDistribution(

                mapChart(
                        employeeRepository
                                .getDepartmentWiseEmployeeCountByCompanyId(
                                        companyId))
        );


        // -----------------------------------------------------
        // EMPLOYEE GROWTH - COMPANY ONLY
        // -----------------------------------------------------

        dto.setEmployeeGrowth(

                mapMonthChart(
                        employeeRepository
                                .employeeGrowthTrendByCompanyId(
                                        companyId))
        );


        // -----------------------------------------------------
        // RESIGNATION TREND - COMPANY ONLY
        // -----------------------------------------------------

        dto.setResignationTrend(

                mapMonthChart(
                        employeeRepository
                                .resignationTrendByCompanyId(
                                        companyId))
        );


        // -----------------------------------------------------
        // COMPANY-WISE EMPLOYEES
        //
        // Do NOT expose other companies to company users.
        // -----------------------------------------------------

        dto.setCompanyWiseEmployees(
                Collections.emptyList());


        return dto;
    }


    // =========================================================
    // MAP RECENT EMPLOYEE
    // =========================================================

    private RecentEmployeeDTO mapRecentEmployee(
            Employee employee) {

        String fullName =
                employee.getFirstName();

        if (employee.getLastName() != null &&
                !employee.getLastName().isBlank()) {

            fullName +=
                    " " + employee.getLastName();
        }


        String departmentName = null;

        if (employee.getDepartment() != null) {

            departmentName =
                    employee.getDepartment()
                            .getDepartmentName();
        }


        String designationName = null;

        if (employee.getDesignation() != null) {

            designationName =
                    employee.getDesignation()
                            .getDesignationName();
        }


        return new RecentEmployeeDTO(

                employee.getEmployeeId(),

                employee.getEmployeeCode(),

                fullName,

                departmentName,

                designationName,

                employee.getJoiningDate()
        );
    }


    // =========================================================
    // MAP HOLIDAY
    // =========================================================

    private UpcomingHolidayDTO mapHoliday(
            Holiday holiday) {

        return new UpcomingHolidayDTO(

                holiday.getHolidayId(),

                holiday.getHolidayName(),

                holiday.getHolidayDate()
        );
    }


    // =========================================================
    // MAP NORMAL CHART
    // =========================================================

    private List<ChartDataDTO> mapChart(
            List<Object[]> data) {

        if (data == null) {

            return Collections.emptyList();
        }

        return data
                .stream()
                .map(obj ->

                        new ChartDataDTO(

                                String.valueOf(
                                        obj[0]),

                                ((Number) obj[1])
                                        .longValue()
                        )
                )
                .collect(Collectors.toList());
    }


    // =========================================================
    // MAP MONTH CHART
    // =========================================================

    private List<ChartDataDTO> mapMonthChart(
            List<Object[]> data) {

        if (data == null) {

            return Collections.emptyList();
        }

        return data
                .stream()
                .map(obj -> {

                    int month =
                            ((Number) obj[0])
                                    .intValue();

                    String monthName =
                            Month.of(month)
                                    .getDisplayName(
                                            TextStyle.SHORT,
                                            Locale.ENGLISH);

                    return new ChartDataDTO(

                            monthName,

                            ((Number) obj[1])
                                    .longValue()
                    );

                })
                .collect(Collectors.toList());
    }
}