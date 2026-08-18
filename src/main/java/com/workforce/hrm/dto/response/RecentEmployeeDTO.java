package com.workforce.hrm.dto.response;

import java.time.LocalDate;

public class RecentEmployeeDTO {

    private Long employeeId;

    private String employeeCode;

    private String fullName;

    private String department;

    private String designation;

    private LocalDate joiningDate;

    public RecentEmployeeDTO() {
    }

    public RecentEmployeeDTO(
            Long employeeId,
            String employeeCode,
            String fullName,
            String department,
            String designation,
            LocalDate joiningDate) {

        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.fullName = fullName;
        this.department = department;
        this.designation = designation;
        this.joiningDate = joiningDate;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(
            Long employeeId) {

        this.employeeId = employeeId;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(
            String employeeCode) {

        this.employeeCode = employeeCode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(
            String fullName) {

        this.fullName = fullName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(
            String department) {

        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(
            String designation) {

        this.designation = designation;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(
            LocalDate joiningDate) {

        this.joiningDate = joiningDate;
    }
}