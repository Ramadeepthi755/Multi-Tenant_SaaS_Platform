package com.workforce.hrm.controller;

import com.workforce.hrm.dto.request.CompanyOnboardingRequest;
import com.workforce.hrm.dto.response.ApiResponse;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.service.CompanyOnboardingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
public class CompanyOnboardingController {

    private final CompanyOnboardingService onboardingService;

    @Autowired
    public CompanyOnboardingController(CompanyOnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @PostMapping("/company")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Company>> onboardCompany(@RequestBody CompanyOnboardingRequest request) {
        Company company = onboardingService.onboardNewTenant(request);
        return ResponseEntity.ok(ApiResponse.success("Company onboarded and provisioned successfully", company));
    }
}
