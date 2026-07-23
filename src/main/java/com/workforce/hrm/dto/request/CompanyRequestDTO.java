package com.workforce.hrm.dto.request;

import jakarta.validation.constraints.*;

public class CompanyRequestDTO {

	@NotBlank(message = "Company Name is required")
	@Size(min = 3, max = 100, message = "Company Name should contain 3 to 100 characters")
	private String companyName;

	@NotBlank(message = "Company Code is required")
	private String companyCode;

	@Email(message = "Invalid Email")
	private String email;

	@Pattern(regexp = "^[0-9]{10}$", message = "Phone Number should contain 10 digits")
	private String phone;

	public CompanyRequestDTO() {
	}

	public CompanyRequestDTO(String companyName, String companyCode, String email, String phone) {
		this.companyName = companyName;
		this.companyCode = companyCode;
		this.email = email;
		this.phone = phone;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCompanyCode() {
		return companyCode;
	}

	public void setCompanyCode(String companyCode) {
		this.companyCode = companyCode;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
}