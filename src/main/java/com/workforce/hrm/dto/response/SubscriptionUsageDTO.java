package com.workforce.hrm.dto.response;

import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionUsageDTO {
    private String planCode;
    private String planName;
    private String status;
    private LocalDate startDate;
    private LocalDate renewalDate;

    private Integer currentEmployees;
    private Integer employeeLimit;

    private Integer currentAdmins;
    private Integer adminLimit;

    private Long storageUsedMb;
    private Long storageLimitMb;

    private Integer aiUsageThisMonth;
    private Integer aiMonthlyQuota;

    private Boolean advancedReportsEnabled;
    private Boolean payrollEnabled;
    private Boolean recruitmentEnabled;

    private List<PlanDetailDTO> availablePlans;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PlanDetailDTO {
        private Long id;
        private String planCode;
        private String name;
        private String description;
        private Double priceMonthly;
        private Integer employeeLimit;
        private Integer adminLimit;
        private Long storageLimitMb;
        private Integer aiMonthlyQuota;
        private Boolean advancedReportsEnabled;
        private Boolean payrollEnabled;
        private Boolean recruitmentEnabled;
    }
}
