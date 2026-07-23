package com.workforce.hrm.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.workforce.hrm.enums.DesignationStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "designations")
public class Designation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long designationId;

	@Column(nullable = false, unique = true)
	private String designationCode;

	@Column(nullable = false)
	private String designationName;

	private String description;

	@Enumerated(EnumType.STRING)
	private DesignationStatus status;



	@ManyToOne
	@JoinColumn(name = "department_id")
	private Department department;

	@JsonIgnore
	@OneToMany(mappedBy = "designation")
	private List<Employee> employees;

	public Designation() {
	}

	public Long getDesignationId() {
		return designationId;
	}

	public void setDesignationId(Long designationId) {
		this.designationId = designationId;
	}

	public String getDesignationCode() {
		return designationCode;
	}

	public void setDesignationCode(String designationCode) {
		this.designationCode = designationCode;
	}

	public String getDesignationName() {
		return designationName;
	}

	public void setDesignationName(String designationName) {
		this.designationName = designationName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	
	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public List<Employee> getEmployees() {
		return employees;
	}

	public void setEmployees(List<Employee> employees) {
		this.employees = employees;
	}
	public DesignationStatus getStatus() {
		return status;
	}

	public void setStatus(DesignationStatus status) {
		this.status = status;
	}
}