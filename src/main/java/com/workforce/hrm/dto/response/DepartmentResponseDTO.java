package com.workforce.hrm.dto.response;

import com.workforce.hrm.enums.DepartmentStatus;

public class DepartmentResponseDTO {

	private Long departmentId;
	private String departmentCode;
	private String departmentName;
	

	private String description;
	private DepartmentStatus status;
	private Long companyId;
	private String companyName;
	private Long employeeCount;

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public String getDepartmentCode() {
		return departmentCode;
	}

	public void setDepartmentCode(String departmentCode) {
		this.departmentCode = departmentCode;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	public DepartmentStatus getStatus() {
		return status;
	}

	public void setStatus(DepartmentStatus status) {
		this.status = status;
	}
	

	public String getCompanyName() {
		return companyName;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public Long getEmployeeCount() {
		return employeeCount;
	}

	public void setEmployeeCount(Long employeeCount) {
		this.employeeCount = employeeCount;
	}
}
