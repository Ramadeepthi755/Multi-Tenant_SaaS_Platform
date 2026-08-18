package com.workforce.hrm.dto.response;

import com.workforce.hrm.enums.DesignationStatus;

public class DesignationResponseDTO {

    private Long designationId;

    private String designationCode;

    private String designationName;

    private String description;

    private DesignationStatus status;

    private String departmentName;

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

    public DesignationStatus getStatus() {
        return status;
    }

    public void setStatus(DesignationStatus status) {
        this.status = status;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }
}