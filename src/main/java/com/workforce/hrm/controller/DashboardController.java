package com.workforce.hrm.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.response.RoleDashboardResponseDTO;
import com.workforce.hrm.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('DASHBOARD_VIEW')")
    public ResponseEntity<RoleDashboardResponseDTO> getDashboard() {

        RoleDashboardResponseDTO response =
                dashboardService.getDashboard();

        return ResponseEntity.ok(response);
    }

}
