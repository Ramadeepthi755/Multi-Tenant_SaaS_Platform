package com.workforce.hrm.dto.response;

public class CompanyResponseDTO {

	private Long id;

	private String companyName;

	private String companyCode;

	private String email;

	private String phone;

	public CompanyResponseDTO() {
	}

	public CompanyResponseDTO(Long id, String companyName, String companyCode, String email, String phone) {
		this.id = id;
		this.companyName = companyName;
		this.companyCode = companyCode;
		this.email = email;
		this.phone = phone;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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