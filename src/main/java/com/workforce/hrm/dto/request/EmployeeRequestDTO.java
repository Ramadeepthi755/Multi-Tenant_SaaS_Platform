package com.workforce.hrm.dto.request;

import jakarta.validation.constraints.*;

public class EmployeeRequestDTO {

	@NotBlank(message = "Employee Code is required")
	private String employeeCode;
	
	@NotBlank(message = "First Name is required")
	private String firstName;

	@Email(message = "Invalid Email Format")
	@NotBlank(message = "Email is required")
	private String email;

	@NotNull(message = "Department Id is required")
	private Long departmentId;

	@NotNull(message = "Designation Id is required")
	private Long designationId;

	// getters setters

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public Long getDesignationId() {
		return designationId;
	}

	public void setDesignationId(Long designationId) {
		this.designationId = designationId;
	}

	
}
