package com.workforce.hrm.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.workforce.hrm.entity.User;

public class CustomUserDetails implements UserDetails {

    private final User user;

    private final List<GrantedAuthority> authorities;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public CustomUserDetails(User user) {

        if (user == null) {
            throw new IllegalArgumentException(
                    "User cannot be null."
            );
        }

        this.user = user;

        this.authorities =
                buildAuthorities(user);
    }


    // =========================================================
    // BUILD AUTHORITIES
    // =========================================================

    private List<GrantedAuthority> buildAuthorities(
            User user) {

        List<GrantedAuthority> result =
                new ArrayList<>();


        // =====================================================
        // ROLE AUTHORITY
        // =====================================================

        if (user.getRole() != null) {

            String roleName =
                    user.getRole()
                            .getRoleName();

            if (roleName != null
                    && !roleName.isBlank()) {

                roleName =
                        roleName.trim()
                                .toUpperCase();


                /*
                 * Spring Security role convention:
                 *
                 * ROLE_COMPANY_ADMIN
                 *
                 * If database already contains ROLE_,
                 * don't add it again.
                 */

                if (roleName.startsWith("ROLE_")) {

                    result.add(
                            new SimpleGrantedAuthority(
                                    roleName
                            )
                    );

                } else {

                    result.add(
                            new SimpleGrantedAuthority(
                                    "ROLE_" + roleName
                            )
                    );
                }
            }


            // =================================================
            // PERMISSION AUTHORITIES
            // =================================================

            /*
             * Role -> Permissions
             *
             * Permission entity has:
             *
             * private String permissionName;
             *
             * Therefore we MUST use:
             *
             * permission.getPermissionName()
             *
             * NOT:
             *
             * permission.toString()
             */

            if (user.getRole().getPermissions() != null) {

                user.getRole()
                        .getPermissions()
                        .forEach(permission -> {

                            if (permission == null) {
                                return;
                            }

                            String permissionName =
                                    permission
                                            .getPermissionName();

                            if (permissionName == null
                                    || permissionName.isBlank()) {

                                return;
                            }

                            permissionName =
                                    permissionName
                                            .trim()
                                            .toUpperCase();

                            result.add(
                                    new SimpleGrantedAuthority(
                                            permissionName
                                    )
                            );
                        });
            }
        }


        // =====================================================
        // REMOVE DUPLICATES
        // =====================================================

        return result
                .stream()
                .distinct()
                .collect(
                        Collectors.toList()
                );
    }


    // =========================================================
    // APPLICATION USER
    // =========================================================

    public User getUser() {

        return user;
    }


    // =========================================================
    // USER ID
    // =========================================================

    public Long getUserId() {

        return user.getUserId();
    }


    // =========================================================
    // FULL NAME
    // =========================================================

    public String getFullName() {

        return user.getFullName();
    }


    // =========================================================
    // ROLE
    // =========================================================

    public String getRole() {

        if (user.getRole() == null) {

            return null;
        }

        return user.getRole()
                .getRoleName();
    }


    // =========================================================
    // AUTHORITIES
    // =========================================================

    @Override
    public Collection<? extends GrantedAuthority>
    getAuthorities() {

        return Collections.unmodifiableList(
                authorities
        );
    }


    // =========================================================
    // PASSWORD
    // =========================================================

    @Override
    public String getPassword() {

        return user.getPassword();
    }


    // =========================================================
    // USERNAME
    // =========================================================

    @Override
    public String getUsername() {

        return user.getEmail();
    }


    // =========================================================
    // ACCOUNT STATUS
    // =========================================================

    @Override
    public boolean isAccountNonExpired() {

        return !Boolean.TRUE.equals(
                user.getAccountExpired()
        );
    }


    @Override
    public boolean isAccountNonLocked() {

        return !Boolean.TRUE.equals(
                user.getAccountLocked()
        );
    }


    @Override
    public boolean isCredentialsNonExpired() {

        return !Boolean.TRUE.equals(
                user.getCredentialsExpired()
        );
    }


    @Override
    public boolean isEnabled() {

        return Boolean.TRUE.equals(
                user.getEnabled()
        )
        && Boolean.TRUE.equals(
                user.isActive()
        );
    }
}