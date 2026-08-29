package com.workforce.hrm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employee_lifecycle_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeLifecycleEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, length = 50)
    private String eventType; // CANDIDATE, HIRED, ONBOARDING, ACTIVE, PROMOTION, TRANSFER, OFFBOARDING, EXIT

    private String previousState;
    private String newState;

    @Column(length = 100)
    private String actorEmail;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 1000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
