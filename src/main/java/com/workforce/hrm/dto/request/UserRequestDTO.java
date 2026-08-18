package com.workforce.hrm.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserRequestDTO {

    // =========================================================
    // BASIC INFORMATION
    // =========================================================

    @NotBlank(message = "Full name is required")
    private String fullName;


    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    private String email;


    // =========================================================
    // PASSWORD
    // =========================================================

    /*
     * Password is intentionally NOT @NotBlank here.
     *
     * Reason:
     *
     * Same DTO is currently used for:
     *
     * CREATE USER
     * UPDATE USER
     *
     * CREATE:
     * Password will be validated as mandatory
     * inside UserServiceImpl.
     *
     * UPDATE:
     * Password can be null/blank.
     * Existing password will remain unchanged.
     */
    @Size(
        min = 8,
        message = "Password must contain at least 8 characters"
    )
    private String password;


    // =========================================================
    // ROLE
    // =========================================================

    @NotNull(message = "Role ID is required")
    private Long roleId;


    // =========================================================
    // COMPANY
    // =========================================================

    /*
     * SUPER_ADMIN:
     *
     * Can provide companyId when creating a
     * company-specific user.
     *
     * COMPANY_ADMIN / HR:
     *
     * Service layer ignores this value and uses:
     *
     * SecurityUtils.getCurrentCompanyId()
     *
     * Therefore frontend cannot use companyId
     * to cross tenant boundaries.
     */
    private Long companyId;


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

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


    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(
            Long roleId) {

        this.roleId = roleId;
    }


    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(
            Long companyId) {

        this.companyId = companyId;
    }
}