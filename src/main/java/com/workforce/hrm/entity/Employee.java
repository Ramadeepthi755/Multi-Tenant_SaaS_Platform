package com.workforce.hrm.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.workforce.hrm.enums.EmployeeStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "employees")
public class Employee {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long employeeId;

	@Column(nullable = false, unique = true)
	private String employeeCode;

	@Column(nullable = false)
	private String firstName;

	private String lastName;

	@Column(nullable = false, unique = true)
	private String email;

	private String phone;

	private String gender;

	private LocalDate dateOfBirth;

	private LocalDate joiningDate;

	private Double salary;

	@Enumerated(EnumType.STRING)
	private EmployeeStatus status;
	private LocalDate resignationDate;

	// Department Relation
	@ManyToOne
	@JoinColumn(name = "department_id")
	private Department department;

	// Designation Relation
	@ManyToOne
	@JoinColumn(name = "designation_id")
	private Designation designation;

	// Attendance Relation
	@JsonIgnore
	@OneToMany(mappedBy = "employee")
	private List<Attendance> attendanceRecords;

	// Leave Relation
	@JsonIgnore
	@OneToMany(mappedBy = "employee")
	private List<Leave> leaves;

	// Payroll Relation
	@JsonIgnore
	@OneToMany(mappedBy = "employee")
	private List<Payroll> payrolls;
	@JsonIgnore
	@OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<EmployeeDocument> documents = new ArrayList<>();
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_id", nullable = false)
	private Company company;
	public Employee() {
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

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

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
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

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public LocalDate getJoiningDate() {
		return joiningDate;
	}

	public void setJoiningDate(LocalDate joiningDate) {
		this.joiningDate = joiningDate;
	}

	public Double getSalary() {
		return salary;
	}

	public void setSalary(Double salary) {
		this.salary = salary;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public Designation getDesignation() {
		return designation;
	}

	public void setDesignation(Designation designation) {
		this.designation = designation;
	}

	public List<Attendance> getAttendanceRecords() {
		return attendanceRecords;
	}

	public void setAttendanceRecords(List<Attendance> attendanceRecords) {
		this.attendanceRecords = attendanceRecords;
	}

	public List<Leave> getLeaves() {
		return leaves;
	}

	public void setLeaves(List<Leave> leaves) {
		this.leaves = leaves;
	}

	public List<Payroll> getPayrolls() {
		return payrolls;
	}

	public void setPayrolls(List<Payroll> payrolls) {
		this.payrolls = payrolls;
	}

	public EmployeeStatus getStatus() {
		return status;
	}

	public void setStatus(EmployeeStatus status) {
		this.status = status;
	}
	public LocalDate getResignationDate() {
	    return resignationDate;
	}

	public void setResignationDate(LocalDate resignationDate) {
	    this.resignationDate = resignationDate;
	}

	public List<EmployeeDocument> getDocuments() {
	    return documents;
	}

	public void setDocuments(List<EmployeeDocument> documents) {
	    this.documents = documents;
	}
	public Company getCompany() {
	    return company;
	}

	public void setCompany(Company company) {
	    this.company = company;
	}
}