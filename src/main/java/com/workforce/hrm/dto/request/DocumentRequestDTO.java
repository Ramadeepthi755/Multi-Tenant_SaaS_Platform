package com.workforce.hrm.dto.request;

import com.workforce.hrm.enums.DocumentType;

import jakarta.validation.constraints.NotNull;

public class DocumentRequestDTO {

    @NotNull(message = "Employee Id is required")
    private Long employeeId;

    @NotNull(message = "Document Type is required")
    private DocumentType documentType;

    public DocumentRequestDTO() {
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }
}