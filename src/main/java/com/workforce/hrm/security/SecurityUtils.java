package com.workforce.hrm.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.workforce.hrm.entity.User;

public class SecurityUtils {

    private SecurityUtils() {
    }

    /**
     * Returns logged in User entity
     */
    public static User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails customUserDetails) {
            return customUserDetails.getUser();
        }

        return null;
    }

    /**
     * Current User Id
     */
    public static Long getCurrentUserId() {

        User user = getCurrentUser();

        return user != null
                ? user.getUserId()
                : null;
    }

    /**
     * Current Company Id
     */
    public static Long getCurrentCompanyId() {

        User user = getCurrentUser();

        if (user == null || user.getCompany() == null) {
            return null;
        }

        return user.getCompany().getId();
    }

    /**
     * Current Role
     */
    public static String getCurrentRole() {

        User user = getCurrentUser();

        if (user == null || user.getRole() == null) {
            return null;
        }

        return user.getRole().getRoleName();
    }

    /**
     * Current User Email
     */
    public static String getCurrentUserEmail() {

        User user = getCurrentUser();

        return user != null
                ? user.getEmail()
                : null;
    }

    /**
     * SUPER_ADMIN ?
     */
    public static boolean isSuperAdmin() {

        return "SUPER_ADMIN".equals(getCurrentRole());
    }

}