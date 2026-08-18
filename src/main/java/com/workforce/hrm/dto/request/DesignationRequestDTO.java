package com.workforce.hrm.dto.request;

import com.workforce.hrm.enums.DesignationStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class DesignationRequestDTO {

    @NotBlank(message = "Designation Code is required")
    @Size(max = 20)
    private String designationCode;

    @NotBlank(message = "Designation Name is required")
    @Size(max = 100)
    private String designationName;

    @Size(max = 500)
    private String description;

    @NotNull(message = "Status is required")
    private DesignationStatus status;

    @NotNull(message = "Department is required")
    private Long departmentId;

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

    public DesignationStatus getStatus() {
        return status;
    }

    public void setStatus(DesignationStatus status) {
        this.status = status;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}