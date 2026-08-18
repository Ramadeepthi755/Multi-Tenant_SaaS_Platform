package com.workforce.hrm.service;

import com.workforce.hrm.dto.response.DashboardResponseDTO;

public interface DashboardService {

    /**
     * Returns complete dashboard data.
     */
    DashboardResponseDTO getDashboard();

}