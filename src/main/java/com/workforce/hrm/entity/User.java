package com.workforce.hrm.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(
            nullable = false,
            length = 100
    )
    private String fullName;

    @Column(
            nullable = false,
            unique = true,
            length = 100
    )
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne(
            fetch = FetchType.EAGER
    )
    @JoinColumn(
            name = "role_id",
            nullable = false
    )
    private Role role;

    /*
     * KEEP LAZY.
     *
     * Do NOT change this to EAGER.
     * Authentication response uses DTO mapping.
     */
    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "company_id"
    )
    private Company company;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(nullable = false)
    private Boolean accountLocked = false;

    @Column(nullable = false)
    private Boolean accountExpired = false;

    @Column(nullable = false)
    private Boolean credentialsExpired = false;

    @Column(nullable = false)
    private Integer failedAttempts = 0;

    private LocalDateTime lockTime;

    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(name = "profile_photo")
    private String profilePhoto;
    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(
            name = "created_at",
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }

    public User() {
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

    public void setFullName(
            String fullName) {

        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password) {

        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(
            Role role) {

        this.role = role;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(
            Company company) {

        this.company = company;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(
            Boolean enabled) {

        this.enabled = enabled;
    }

    public Boolean getAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(
            Boolean accountLocked) {

        this.accountLocked = accountLocked;
    }

    public Boolean getAccountExpired() {
        return accountExpired;
    }

    public void setAccountExpired(
            Boolean accountExpired) {

        this.accountExpired = accountExpired;
    }

    public Boolean getCredentialsExpired() {
        return credentialsExpired;
    }

    public void setCredentialsExpired(
            Boolean credentialsExpired) {

        this.credentialsExpired =
                credentialsExpired;
    }

    public Integer getFailedAttempts() {
        return failedAttempts;
    }

    public void setFailedAttempts(
            Integer failedAttempts) {

        this.failedAttempts =
                failedAttempts;
    }

    public LocalDateTime getLockTime() {
        return lockTime;
    }

    public void setLockTime(
            LocalDateTime lockTime) {

        this.lockTime = lockTime;
    }

    public Boolean isActive() {
        return active;
    }

    public void setActive(
            Boolean active) {

        this.active = active;
    }

    public Boolean isAccountLocked() {
        return accountLocked;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(
            LocalDateTime lastLogin) {

        this.lastLogin = lastLogin;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
}