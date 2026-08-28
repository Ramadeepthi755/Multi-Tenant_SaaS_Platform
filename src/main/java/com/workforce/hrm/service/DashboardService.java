package com.workforce.hrm.service;

import com.workforce.hrm.dto.response.RoleDashboardResponseDTO;

public interface DashboardService {

    /**
     * Returns complete dashboard data.
     */
    RoleDashboardResponseDTO getDashboard();

}
