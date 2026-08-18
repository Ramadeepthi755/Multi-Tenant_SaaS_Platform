package com.workforce.hrm.mapper;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.stream.Collectors;

import com.workforce.hrm.dto.request.UserRequestDTO;
import com.workforce.hrm.dto.response.UserResponse;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Role;
import com.workforce.hrm.entity.User;

public class UserMapper {

    private UserMapper() {
        // Utility class
    }


    // =========================================================
    // DATE FORMAT
    // =========================================================

    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


    // =========================================================
    // REQUEST DTO -> ENTITY
    // =========================================================

    public static User toEntity(
            UserRequestDTO dto,
            Role role,
            Company company) {

        if (dto == null) {
            return null;
        }

        User user = new User();

        user.setFullName(
                dto.getFullName());

        user.setEmail(
                dto.getEmail());

        /*
         * IMPORTANT:
         *
         * Password is NOT encoded inside mapper.
         *
         * UserServiceImpl is responsible for:
         *
         * passwordEncoder.encode(...)
         */
        user.setPassword(
                dto.getPassword());

        user.setRole(role);

        /*
         * Company has already been validated
         * by UserServiceImpl before reaching mapper.
         */
        user.setCompany(company);

        // Default account state
        user.setEnabled(true);
        user.setActive(true);
        user.setAccountLocked(false);
        user.setAccountExpired(false);
        user.setCredentialsExpired(false);
        user.setFailedAttempts(0);

        return user;
    }


    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    public static UserResponse toResponse(
            User user) {

        if (user == null) {
            return null;
        }

        UserResponse response =
                new UserResponse();

        // -----------------------------------------------------
        // BASIC USER INFORMATION
        // -----------------------------------------------------

        response.setUserId(
                user.getUserId());

        response.setFullName(
                user.getFullName());

        response.setEmail(
                user.getEmail());


        // -----------------------------------------------------
        // ROLE + PERMISSIONS
        // -----------------------------------------------------

        if (user.getRole() != null) {

            response.setRole(
                    user.getRole()
                            .getRoleName());

            if (user.getRole()
                    .getPermissions() != null) {

                response.setPermissions(
                        user.getRole()
                                .getPermissions()
                                .stream()
                                .map(permission ->
                                        permission
                                                .getPermissionName())
                                .collect(
                                        Collectors.toList()));

            } else {

                response.setPermissions(
                        Collections.emptyList());
            }

        } else {

            response.setPermissions(
                    Collections.emptyList());
        }


        // -----------------------------------------------------
        // COMPANY / TENANT INFORMATION
        // -----------------------------------------------------

        if (user.getCompany() != null) {

            response.setCompanyId(
                    user.getCompany()
                            .getId());

            response.setCompanyName(
                    user.getCompany()
                            .getCompanyName());
        }


        // -----------------------------------------------------
        // ACCOUNT STATUS
        // -----------------------------------------------------

        boolean active =
                Boolean.TRUE.equals(
                        user.isActive());

        boolean locked =
                Boolean.TRUE.equals(
                        user.isAccountLocked());

        boolean enabled =
                Boolean.TRUE.equals(
                        user.getEnabled());

        response.setActive(active);

        response.setAccountLocked(
                locked);


        // -----------------------------------------------------
        // HUMAN-READABLE STATUS
        // -----------------------------------------------------

        String status;

        if (locked) {

            status = "LOCKED";

        } else if (!enabled) {

            status = "DISABLED";

        } else if (!active) {

            status = "INACTIVE";

        } else {

            status = "ACTIVE";
        }

        response.setStatus(status);


        // -----------------------------------------------------
        // CREATED DATE
        // -----------------------------------------------------

        if (user.getCreatedAt() != null) {

            response.setCreatedDate(
                    user.getCreatedAt()
                            .format(
                                    DATE_TIME_FORMATTER));
        }


        // -----------------------------------------------------
        // LAST LOGIN
        // -----------------------------------------------------

        if (user.getLastLogin() != null) {

            response.setLastLogin(
                    user.getLastLogin()
                            .format(
                                    DATE_TIME_FORMATTER));

        } else {

            response.setLastLogin(null);
        }


        return response;
    }


    // =========================================================
    // UPDATE EXISTING USER
    // =========================================================

    public static void updateEntity(
            User user,
            UserRequestDTO dto,
            Role role) {

        if (user == null || dto == null) {
            return;
        }

        user.setFullName(
                dto.getFullName());

        user.setEmail(
                dto.getEmail());

        /*
         * IMPORTANT:
         *
         * Password is intentionally NOT updated here.
         *
         * UserServiceImpl will encode and update
         * password when request contains one.
         */

        user.setRole(role);


        /*
         * VERY IMPORTANT TENANT SECURITY:
         *
         * DO NOT:
         *
         * user.setCompany(...)
         *
         * during normal update.
         *
         * Existing user's company ownership must remain
         * unchanged.
         *
         * Example:
         *
         * Company A User
         *      ↓
         * PUT /users/{id}
         *      ↓
         * still Company A
         *
         * Request cannot move user to Company B.
         */
    }
}