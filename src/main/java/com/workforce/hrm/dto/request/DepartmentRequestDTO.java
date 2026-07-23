package com.workforce.hrm.dto.request;

import jakarta.validation.constraints.NotBlank;

public class DepartmentRequestDTO {
	@NotBlank
	private String departmentCode;
	@NotBlank
	private String departmentName;
	@NotBlank
	private String description;
	@NotBlank
	private String status;
	@NotBlank
	private Long companyId;

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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}
}