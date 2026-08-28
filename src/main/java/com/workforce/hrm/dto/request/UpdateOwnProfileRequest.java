package com.workforce.hrm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * The deliberately small set of fields an authenticated user may change on
 * their own account. Roles, tenant membership, account state and passwords
 * must continue to use their dedicated, authorised workflows.
 */
public class UpdateOwnProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 120, message = "Full name must be 120 characters or fewer")
    private String fullName;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
