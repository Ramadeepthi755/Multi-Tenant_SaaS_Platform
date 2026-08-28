package com.workforce.hrm.config;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.workforce.hrm.entity.Permission;
import com.workforce.hrm.entity.Role;
import com.workforce.hrm.repository.PermissionRepository;
import com.workforce.hrm.repository.RoleRepository;

@Component
@Order(3)
public class RolePermissionSeeder implements CommandLineRunner {

    private static final Logger log =
            LoggerFactory.getLogger(RolePermissionSeeder.class);

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RolePermissionSeeder(RoleRepository roleRepository,
                                PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public void run(String... args) {

        assignSuperAdminPermissions();

        assignCompanyAdminPermissions();

        assignHRPermissions();

        assignManagerPermissions();

        assignEmployeePermissions();

        log.info("Role Permission Mapping Completed.");
    }

    /**
     * SUPER ADMIN -> ALL PERMISSIONS
     */
    private void assignSuperAdminPermissions() {

        Role role = roleRepository.findByRoleName("SUPER_ADMIN").orElse(null);

        if (role == null)
            return;

        role.setPermissions(new HashSet<>(permissionRepository.findAll()));

        roleRepository.save(role);

        log.info("SUPER_ADMIN permissions assigned.");
    }

    /**
     * COMPANY ADMIN
     */
    private void assignCompanyAdminPermissions() {

        Role role = roleRepository.findByRoleName("COMPANY_ADMIN").orElse(null);

        if (role == null)
            return;

        Set<String> permissions = Set.of(

                "COMPANY_READ",
                "COMPANY_UPDATE",

                "DEPARTMENT_CREATE",
                "DEPARTMENT_READ",
                "DEPARTMENT_UPDATE",
                "DEPARTMENT_DELETE",

                "DESIGNATION_CREATE",
                "DESIGNATION_READ",
                "DESIGNATION_UPDATE",
                "DESIGNATION_DELETE",

                "EMPLOYEE_CREATE",
                "EMPLOYEE_READ",
                "EMPLOYEE_UPDATE",
                "EMPLOYEE_DELETE",

                "ATTENDANCE_READ",

                "LEAVE_READ",
                "LEAVE_APPROVE",
                "LEAVE_REJECT",

                "PAYROLL_READ",

                "HOLIDAY_CREATE",
                "HOLIDAY_READ",
                "HOLIDAY_UPDATE",
                "HOLIDAY_DELETE",

                "DOCUMENT_UPLOAD",
                "DOCUMENT_DOWNLOAD",
                "DOCUMENT_DELETE",

                "NOTIFICATION_READ",

                "DASHBOARD_VIEW"

        );

        assignPermissions(role, permissions);

        log.info("COMPANY_ADMIN permissions assigned.");
    }

    /**
     * HR
     */
    private void assignHRPermissions() {

        Role role = roleRepository.findByRoleName("HR").orElse(null);

        if (role == null)
            return;

        Set<String> permissions = Set.of(

                "COMPANY_READ",

                "DEPARTMENT_READ",

                "DESIGNATION_READ",

                "EMPLOYEE_CREATE",
                "EMPLOYEE_READ",
                "EMPLOYEE_UPDATE",

                "ATTENDANCE_CREATE",
                "ATTENDANCE_READ",
                "ATTENDANCE_UPDATE",

                "LEAVE_READ",
                "LEAVE_APPROVE",
                "LEAVE_REJECT",

                "DOCUMENT_UPLOAD",
                "DOCUMENT_DOWNLOAD",
                "DOCUMENT_DELETE",

                "HOLIDAY_READ",

                "NOTIFICATION_READ",

                "PAYROLL_READ",

                "DASHBOARD_VIEW"

        );

        assignPermissions(role, permissions);

        log.info("HR permissions assigned.");
    }

    /**
     * MANAGER
     */
    private void assignManagerPermissions() {

        Role role = roleRepository.findByRoleName("MANAGER").orElse(null);

        if (role == null)
            return;

        Set<String> permissions = Set.of(

                "EMPLOYEE_READ",

                "ATTENDANCE_READ",

                "LEAVE_READ",
                "LEAVE_APPROVE",
                "LEAVE_REJECT",

                "DOCUMENT_DOWNLOAD",

                "HOLIDAY_READ",

                "NOTIFICATION_READ",

                "DASHBOARD_VIEW"

        );

        assignPermissions(role, permissions);

        log.info("MANAGER permissions assigned.");
    }

    /**
     * EMPLOYEE
     */
    private void assignEmployeePermissions() {

        Role role = roleRepository.findByRoleName("EMPLOYEE").orElse(null);

        if (role == null)
            return;

        Set<String> permissions = Set.of(

                "ATTENDANCE_READ",

                "LEAVE_CREATE",
                "LEAVE_READ",

                "DOCUMENT_UPLOAD",
                "DOCUMENT_DOWNLOAD",

                "NOTIFICATION_READ",

                "PAYROLL_READ",

                "HOLIDAY_READ",

                "DASHBOARD_VIEW"

        );

        assignPermissions(role, permissions);

        log.info("EMPLOYEE permissions assigned.");
    }

    /**
     * Common Method
     */
    private void assignPermissions(Role role, Set<String> permissionNames) {

        List<Permission> permissions = permissionRepository.findAll()
                .stream()
                .filter(permission ->
                        permissionNames.contains(permission.getPermissionName()))
                .toList();

        role.setPermissions(new HashSet<>(permissions));

        roleRepository.save(role);
    }

}
