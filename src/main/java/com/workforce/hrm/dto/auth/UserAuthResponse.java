package com.workforce.hrm.dto.auth;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class UserAuthResponse {

    private Long userId;

    private String fullName;

    private String email;

    private String role;

    private List<String> permissions = new ArrayList<>();

    private Boolean active;

    private Boolean accountLocked;

    private String status;

    private Long companyId;

    private String companyName;

    private String createdDate;

    private String lastLogin;

    public UserAuthResponse() {
    }

    public UserAuthResponse(
            Long userId,
            String fullName,
            String email,
            String role,
            List<String> permissions,
            Boolean active,
            Boolean accountLocked,
            String status,
            Long companyId,
            String companyName,
            LocalDateTime createdDate,
            LocalDateTime lastLogin) {

        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;

        if (permissions != null) {
            this.permissions = new ArrayList<>(permissions);
        }

        this.active = active;
        this.accountLocked = accountLocked;
        this.status = status;
        this.companyId = companyId;
        this.companyName = companyName;

        this.createdDate = formatDate(createdDate);
        this.lastLogin = formatDate(lastLogin);
    }

    private String formatDate(LocalDateTime dateTime) {

        if (dateTime == null) {
            return null;
        }

        return dateTime.format(
                DateTimeFormatter.ofPattern(
                        "yyyy-MM-dd HH:mm:ss"
                )
        );
    }

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

    public void setPermissions(List<String> permissions) {
        this.permissions =
                permissions != null
                        ? new ArrayList<>(permissions)
                        : new ArrayList<>();
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(Boolean accountLocked) {
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

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(String lastLogin) {
        this.lastLogin = lastLogin;
    }
}