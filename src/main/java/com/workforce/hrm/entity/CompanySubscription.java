package com.workforce.hrm.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company_subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanySubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false, unique = true)
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    @Column(nullable = false, length = 50)
    private String status; // TRIAL, ACTIVE, SUSPENDED, CANCELLED

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate renewalDate;

    @Builder.Default
    private Integer aiUsageThisMonth = 0;

    @Builder.Default
    private Long storageUsedMb = 0L;
}
