package com.workforce.hrm.controller;

import com.workforce.hrm.service.SettingsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(
            SettingsService settingsService
    ) {
        this.settingsService = settingsService;
    }

    // =========================================================
    // GET ALL
    // GET /api/settings
    // =========================================================

    @GetMapping
    public ResponseEntity<Map<String, Object>>
    getSettings() {

        return ResponseEntity.ok(
                settingsService.getSettings()
        );
    }

    // =========================================================
    // COMPANY
    // =========================================================

    @GetMapping("/company")
    public ResponseEntity<Map<String, Object>>
    getCompanySettings() {

        return ResponseEntity.ok(
                settingsService.getSettings("company")
        );
    }

    @PutMapping("/company")
    public ResponseEntity<Map<String, Object>>
    updateCompanySettings(
            @RequestBody Map<String, Object> settings
    ) {

        return ResponseEntity.ok(
                settingsService.updateSettings(
                        "company",
                        settings
                )
        );
    }

    // =========================================================
    // GENERAL
    // =========================================================

    @GetMapping("/general")
    public ResponseEntity<Map<String, Object>>
    getGeneralSettings() {

        return ResponseEntity.ok(
                settingsService.getSettings("general")
        );
    }

    @PutMapping("/general")
    public ResponseEntity<Map<String, Object>>
    updateGeneralSettings(
            @RequestBody Map<String, Object> settings
    ) {

        return ResponseEntity.ok(
                settingsService.updateSettings(
                        "general",
                        settings
                )
        );
    }

    // =========================================================
    // ATTENDANCE
    // =========================================================

    @GetMapping("/attendance")
    public ResponseEntity<Map<String, Object>>
    getAttendanceSettings() {

        return ResponseEntity.ok(
                settingsService.getSettings("attendance")
        );
    }

    @PutMapping("/attendance")
    public ResponseEntity<Map<String, Object>>
    updateAttendanceSettings(
            @RequestBody Map<String, Object> settings
    ) {

        return ResponseEntity.ok(
                settingsService.updateSettings(
                        "attendance",
                        settings
                )
        );
    }

    // =========================================================
    // LEAVE
    // =========================================================

    @GetMapping("/leave")
    public ResponseEntity<Map<String, Object>>
    getLeaveSettings() {

        return ResponseEntity.ok(
                settingsService.getSettings("leave")
        );
    }

    @PutMapping("/leave")
    public ResponseEntity<Map<String, Object>>
    updateLeaveSettings(
            @RequestBody Map<String, Object> settings
    ) {

        return ResponseEntity.ok(
                settingsService.updateSettings(
                        "leave",
                        settings
                )
        );
    }

    // =========================================================
    // PAYROLL
    // =========================================================

    @GetMapping("/payroll")
    public ResponseEntity<Map<String, Object>>
    getPayrollSettings() {

        return ResponseEntity.ok(
                settingsService.getSettings("payroll")
        );
    }

    @PutMapping("/payroll")
    public ResponseEntity<Map<String, Object>>
    updatePayrollSettings(
            @RequestBody Map<String, Object> settings
    ) {

        return ResponseEntity.ok(
                settingsService.updateSettings(
                        "payroll",
                        settings
                )
        );
    }

    // =========================================================
    // NOTIFICATIONS
    // =========================================================

    @GetMapping("/notifications")
    public ResponseEntity<Map<String, Object>>
    getNotificationSettings() {

        return ResponseEntity.ok(
                settingsService.getSettings("notifications")
        );
    }

    @PutMapping("/notifications")
    public ResponseEntity<Map<String, Object>>
    updateNotificationSettings(
            @RequestBody Map<String, Object> settings
    ) {

        return ResponseEntity.ok(
                settingsService.updateSettings(
                        "notifications",
                        settings
                )
        );
    }

    // =========================================================
    // SECURITY
    // =========================================================

    @GetMapping("/security")
    public ResponseEntity<Map<String, Object>>
    getSecuritySettings() {

        return ResponseEntity.ok(
                settingsService.getSettings("security")
        );
    }

    @PutMapping("/security")
    public ResponseEntity<Map<String, Object>>
    updateSecuritySettings(
            @RequestBody Map<String, Object> settings
    ) {

        return ResponseEntity.ok(
                settingsService.updateSettings(
                        "security",
                        settings
                )
        );
    }
}