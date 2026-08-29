package com.workforce.hrm.service;

import com.workforce.hrm.dto.request.CompanyOnboardingRequest;
import com.workforce.hrm.entity.Company;

public interface CompanyOnboardingService {
    Company onboardNewTenant(CompanyOnboardingRequest request);
}
