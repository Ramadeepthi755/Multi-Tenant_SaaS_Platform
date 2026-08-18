package com.workforce.hrm.dto.response;
import java.math.BigDecimal;
import java.util.List;

public class DashboardResponseDTO {

	private Long activeEmployees;
    private Long totalDepartments;
    private Long totalDesignations;
    private Long todayAttendance;
    private Long todayLeaves;
    private BigDecimal currentMonthPayroll;
    private Long totalHolidays;

    private List<RecentEmployeeDTO> recentEmployees;
    private List<UpcomingHolidayDTO> upcomingHolidays;

    private List<ChartDataDTO> genderDistribution;
    private List<ChartDataDTO> departmentDistribution;
    private List<ChartDataDTO> employeeGrowth;
    private List<ChartDataDTO> resignationTrend;
    private List<ChartDataDTO> companyWiseEmployees;

    public DashboardResponseDTO() {
    }

    private Long totalEmployees;
    public Long getTotalEmployees() {
		return totalEmployees;
	}

	public void setTotalEmployees(Long totalEmployees) {
		this.totalEmployees = totalEmployees;
	}

	public Long getActiveEmployees() {
		return activeEmployees;
	}

	public void setActiveEmployees(Long activeEmployees) {
		this.activeEmployees = activeEmployees;
	}

	public Long getTotalDepartments() {
		return totalDepartments;
	}

	public void setTotalDepartments(Long totalDepartments) {
		this.totalDepartments = totalDepartments;
	}

	public Long getTotalDesignations() {
		return totalDesignations;
	}

	public void setTotalDesignations(Long totalDesignations) {
		this.totalDesignations = totalDesignations;
	}

	public Long getTodayAttendance() {
		return todayAttendance;
	}

	public void setTodayAttendance(Long todayAttendance) {
		this.todayAttendance = todayAttendance;
	}

	public Long getTodayLeaves() {
		return todayLeaves;
	}

	public void setTodayLeaves(Long todayLeaves) {
		this.todayLeaves = todayLeaves;
	}

	public BigDecimal getCurrentMonthPayroll() {
		return currentMonthPayroll;
	}

	public void setCurrentMonthPayroll(BigDecimal currentMonthPayroll) {
		this.currentMonthPayroll = currentMonthPayroll;
	}

	public Long getTotalHolidays() {
		return totalHolidays;
	}

	public void setTotalHolidays(Long totalHolidays) {
		this.totalHolidays = totalHolidays;
	}

	public List<RecentEmployeeDTO> getRecentEmployees() {
		return recentEmployees;
	}

	public void setRecentEmployees(List<RecentEmployeeDTO> recentEmployees) {
		this.recentEmployees = recentEmployees;
	}

	public List<UpcomingHolidayDTO> getUpcomingHolidays() {
		return upcomingHolidays;
	}

	public void setUpcomingHolidays(List<UpcomingHolidayDTO> upcomingHolidays) {
		this.upcomingHolidays = upcomingHolidays;
	}

	public List<ChartDataDTO> getGenderDistribution() {
		return genderDistribution;
	}

	public void setGenderDistribution(List<ChartDataDTO> genderDistribution) {
		this.genderDistribution = genderDistribution;
	}

	public List<ChartDataDTO> getDepartmentDistribution() {
		return departmentDistribution;
	}

	public void setDepartmentDistribution(List<ChartDataDTO> departmentDistribution) {
		this.departmentDistribution = departmentDistribution;
	}

	public List<ChartDataDTO> getEmployeeGrowth() {
		return employeeGrowth;
	}

	public void setEmployeeGrowth(List<ChartDataDTO> employeeGrowth) {
		this.employeeGrowth = employeeGrowth;
	}

	public List<ChartDataDTO> getResignationTrend() {
		return resignationTrend;
	}

	public void setResignationTrend(List<ChartDataDTO> resignationTrend) {
		this.resignationTrend = resignationTrend;
	}

	public List<ChartDataDTO> getCompanyWiseEmployees() {
		return companyWiseEmployees;
	}

	public void setCompanyWiseEmployees(List<ChartDataDTO> companyWiseEmployees) {
		this.companyWiseEmployees = companyWiseEmployees;
	}

}