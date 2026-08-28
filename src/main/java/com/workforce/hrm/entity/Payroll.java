package com.workforce.hrm.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.workforce.hrm.enums.PayrollStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "payroll")
public class Payroll {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long payrollId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	@Column(name = "payroll_month", nullable = false)
	private String month;

	@Column(name = "payroll_year", nullable = false)
	private Integer year;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal basicSalary;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal allowances;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal deductions;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal grossSalary;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal netSalary;

	private LocalDateTime generatedDate;

	@Enumerated(EnumType.STRING)
	private PayrollStatus payrollStatus;

	public Payroll() {
	}

	public Long getPayrollId() {
		return payrollId;
	}

	public void setPayrollId(Long payrollId) {
		this.payrollId = payrollId;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public BigDecimal getBasicSalary() {
		return basicSalary;
	}

	public void setBasicSalary(BigDecimal basicSalary) {
		this.basicSalary = basicSalary;
	}

	public BigDecimal getAllowances() {
		return allowances;
	}

	public void setAllowances(BigDecimal allowances) {
		this.allowances = allowances;
	}

	public BigDecimal getDeductions() {
		return deductions;
	}

	public void setDeductions(BigDecimal deductions) {
		this.deductions = deductions;
	}

	public BigDecimal getGrossSalary() {
		return grossSalary;
	}

	public void setGrossSalary(BigDecimal grossSalary) {
		this.grossSalary = grossSalary;
	}

	public BigDecimal getNetSalary() {
		return netSalary;
	}

	public void setNetSalary(BigDecimal netSalary) {
		this.netSalary = netSalary;
	}

	public LocalDateTime getGeneratedDate() {
		return generatedDate;
	}

	public void setGeneratedDate(LocalDateTime generatedDate) {
		this.generatedDate = generatedDate;
	}

	public PayrollStatus getPayrollStatus() {
		return payrollStatus;
	}

	public void setPayrollStatus(PayrollStatus payrollStatus) {
		this.payrollStatus = payrollStatus;
	}

}