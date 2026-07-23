package com.workforce.hrm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.workforce.hrm.enums.LeaveStatus;
import com.workforce.hrm.enums.LeaveType;

@Entity
@Table(name = "leaves")
public class Leave {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long leaveId;

	@Enumerated(EnumType.STRING)
	private LeaveType leaveType;

	


	@Enumerated(EnumType.STRING)
	private LeaveStatus status;

private LocalDate startDate;

	private LocalDate endDate;

	private String reason;

	
	public Leave() {
	}

	public Long getLeaveId() {
		return leaveId;
	}

	public void setLeaveId(Long leaveId) {
		this.leaveId = leaveId;
	}

	

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}
	public LeaveStatus getStatus() {
		return status;
	}

	public void setStatus(LeaveStatus status) {
		this.status = status;
	}

	public void setLeaveType(LeaveType leaveType) {
		this.leaveType = leaveType;
	}
	public LeaveType getLeaveType() {
		return leaveType;
	}

	@ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}
}