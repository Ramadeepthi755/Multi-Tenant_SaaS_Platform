package com.workforce.hrm.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    // =========================================================
    // PRIMARY KEY
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // USER INFORMATION
    // =========================================================

    private Long userId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private Long companyId;


    // =========================================================
    // AUDIT INFORMATION
    // =========================================================

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String module;

    @Column(length = 1000)
    private String details;


    // =========================================================
    // REQUEST INFORMATION
    // =========================================================

    private String ipAddress;


    // =========================================================
    // TIMESTAMP
    // =========================================================

    @Column(nullable = false)
    private LocalDateTime createdAt;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AuditLog() {
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