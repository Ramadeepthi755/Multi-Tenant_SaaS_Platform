package com.workforce.hrm.dto.request;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyOnboardingRequest {
    private String companyName;
    private String companyCode;
    private String domain;
    private String contactEmail;
    private String contactPhone;
    private String address;

    private String timezone;
    private String currency;
    private String locale;
    private List<String> workingDays;
    private List<String> initialDepartments;
    private List<String> initialDesignations;
    private Integer annualLeaveQuota;
    private Integer sickLeaveQuota;
}
