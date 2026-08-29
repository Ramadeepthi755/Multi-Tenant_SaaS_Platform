package com.workforce.hrm.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subscription_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String planCode; // TRIAL, STARTER, PROFESSIONAL, ENTERPRISE

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal priceMonthly;

    @Column(nullable = false)
    private Integer employeeLimit;

    @Column(nullable = false)
    private Integer adminLimit;

    @Column(nullable = false)
    private Long storageLimitMb;

    @Column(nullable = false)
    private Integer aiMonthlyQuota;

    private Boolean advancedReportsEnabled;
    private Boolean payrollEnabled;
    private Boolean recruitmentEnabled;
    private Boolean active;
}
