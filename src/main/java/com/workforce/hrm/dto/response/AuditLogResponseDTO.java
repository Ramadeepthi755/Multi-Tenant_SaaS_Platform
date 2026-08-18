package com.workforce.hrm.dto.response;

import java.time.LocalDateTime;

public class AuditLogResponseDTO {

    // =========================================================
    // AUDIT ID
    // =========================================================

    private Long id;

    // =========================================================
    // USER DETAILS
    // =========================================================

    private Long userId;

    private String userEmail;

    private Long companyId;

    // =========================================================
    // AUDIT DETAILS
    // =========================================================

    private String action;

    private String module;

    private String details;

    // =========================================================
    // REQUEST DETAILS
    // =========================================================

    private String ipAddress;

    // =========================================================
    // TIMESTAMP
    // =========================================================

    private LocalDateTime createdAt;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AuditLogResponseDTO() {
    }

    // =========================================================
    // GETTERS & SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}