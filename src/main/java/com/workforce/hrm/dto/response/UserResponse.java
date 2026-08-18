package com.workforce.hrm.dto.response;

import java.util.List;

public class UserResponse {

    // =========================================================
    // BASIC USER INFORMATION
    // =========================================================

    private Long userId;

    private String fullName;

    private String email;


    // =========================================================
    // ROLE & PERMISSIONS
    // =========================================================

    private String role;

    private List<String> permissions;


    // =========================================================
    // ACCOUNT STATUS
    // =========================================================

    private boolean active;

    private boolean accountLocked;

    /*
     * Possible values:
     *
     * ACTIVE
     * INACTIVE
     * LOCKED
     * DISABLED
     */
    private String status;


    // =========================================================
    // COMPANY / TENANT INFORMATION
    // =========================================================

    private Long companyId;

    private String companyName;


    // =========================================================
    // AUDIT / LOGIN INFORMATION
    // =========================================================

    private String createdDate;

    private String lastLogin;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserResponse() {
    }


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(
            List<String> permissions) {

        this.permissions = permissions;
    }


    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }


    public boolean isAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(
            boolean accountLocked) {

        this.accountLocked = accountLocked;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }


    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(
            String companyName) {

        this.companyName = companyName;
    }


    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(
            String createdDate) {

        this.createdDate = createdDate;
    }


    public String getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(
            String lastLogin) {

        this.lastLogin = lastLogin;
    }
}