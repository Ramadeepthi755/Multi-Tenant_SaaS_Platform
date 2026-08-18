package com.workforce.hrm.dto.request;

import com.workforce.hrm.enums.DepartmentStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DepartmentRequestDTO {

    @NotBlank(message = "Department Code is required")
    private String departmentCode;

    @NotBlank(message = "Department Name is required")
    private String departmentName;

    private String description;

    @NotNull(message = "Status is required")
    private DepartmentStatus status;

    
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

    public DepartmentStatus getStatus() {
        return status;
    }

    public void setStatus(DepartmentStatus status) {
        this.status = status;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }
}