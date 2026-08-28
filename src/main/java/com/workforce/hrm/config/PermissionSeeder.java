package com.workforce.hrm.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.workforce.hrm.entity.Permission;
import com.workforce.hrm.repository.PermissionRepository;

@Component
@Order(2)
public class PermissionSeeder implements CommandLineRunner {

    private static final Logger log =
            LoggerFactory.getLogger(PermissionSeeder.class);

    private final PermissionRepository permissionRepository;

    public PermissionSeeder(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @Override
    public void run(String... args) {
        // ================= COMPANY =================
        createPermission("COMPANY_CREATE", "Create Company", "COMPANY");
        createPermission("COMPANY_READ", "View Company", "COMPANY");
        createPermission("COMPANY_UPDATE", "Update Company", "COMPANY");
        createPermission("COMPANY_DELETE", "Delete Company", "COMPANY");

        // ================= DEPARTMENT =================
        createPermission("DEPARTMENT_CREATE", "Create Department", "DEPARTMENT");
        createPermission("DEPARTMENT_READ", "View Department", "DEPARTMENT");
        createPermission("DEPARTMENT_UPDATE", "Update Department", "DEPARTMENT");
        createPermission("DEPARTMENT_DELETE", "Delete Department", "DEPARTMENT");

        // ================= DESIGNATION =================
        createPermission("DESIGNATION_CREATE", "Create Designation", "DESIGNATION");
        createPermission("DESIGNATION_READ", "View Designation", "DESIGNATION");
        createPermission("DESIGNATION_UPDATE", "Update Designation", "DESIGNATION");
        createPermission("DESIGNATION_DELETE", "Delete Designation", "DESIGNATION");

        // ================= EMPLOYEE =================
        createPermission("EMPLOYEE_CREATE", "Create Employee", "EMPLOYEE");
        createPermission("EMPLOYEE_READ", "View Employee", "EMPLOYEE");
        createPermission("EMPLOYEE_UPDATE", "Update Employee", "EMPLOYEE");
        createPermission("EMPLOYEE_DELETE", "Delete Employee", "EMPLOYEE");

        // ================= ATTENDANCE =================
        createPermission("ATTENDANCE_CREATE", "Create Attendance", "ATTENDANCE");
        createPermission("ATTENDANCE_READ", "View Attendance", "ATTENDANCE");
        createPermission("ATTENDANCE_UPDATE", "Update Attendance", "ATTENDANCE");
        createPermission("ATTENDANCE_DELETE", "Delete Attendance", "ATTENDANCE");

        // ================= LEAVE =================
        createPermission("LEAVE_CREATE", "Apply Leave", "LEAVE");
        createPermission("LEAVE_READ", "View Leave", "LEAVE");
        createPermission("LEAVE_APPROVE", "Approve Leave", "LEAVE");
        createPermission("LEAVE_REJECT", "Reject Leave", "LEAVE");

        // ================= PAYROLL =================
        createPermission("PAYROLL_CREATE", "Generate Payroll", "PAYROLL");
        createPermission("PAYROLL_READ", "View Payroll", "PAYROLL");
        createPermission("PAYROLL_UPDATE", "Update Payroll", "PAYROLL");
        createPermission("PAYROLL_DELETE", "Delete Payroll", "PAYROLL");

        // ================= HOLIDAY =================
        createPermission("HOLIDAY_CREATE", "Create Holiday", "HOLIDAY");
        createPermission("HOLIDAY_READ", "View Holiday", "HOLIDAY");
        createPermission("HOLIDAY_UPDATE", "Update Holiday", "HOLIDAY");
        createPermission("HOLIDAY_DELETE", "Delete Holiday", "HOLIDAY");

        // ================= USER =================
        createPermission("USER_CREATE", "Create User", "USER");
        createPermission("USER_READ", "View User", "USER");
        createPermission("USER_UPDATE", "Update User", "USER");
        createPermission("USER_DELETE", "Delete User", "USER");

        // ================= DOCUMENT =================
        createPermission("DOCUMENT_UPLOAD", "Upload Document", "DOCUMENT");
        createPermission("DOCUMENT_DOWNLOAD", "Download Document", "DOCUMENT");
        createPermission("DOCUMENT_DELETE", "Delete Document", "DOCUMENT");

        // ================= NOTIFICATION =================
        createPermission("NOTIFICATION_SEND", "Send Notification", "NOTIFICATION");
        createPermission("NOTIFICATION_READ", "View Notification", "NOTIFICATION");

        // ================= DASHBOARD =================
        createPermission("DASHBOARD_VIEW", "View Dashboard", "DASHBOARD");

        log.info("Default permissions verified successfully.");
    }

    private void createPermission(String permissionName,
                                  String description,
                                  String module) {

        if (permissionRepository.existsByPermissionName(permissionName)) {
            return;
        }

        Permission permission = new Permission();

        permission.setPermissionName(permissionName);
        permission.setDescription(description);
        permission.setModule(module);

        permissionRepository.save(permission);

        log.info("{} permission created.", permissionName);
    }
}
