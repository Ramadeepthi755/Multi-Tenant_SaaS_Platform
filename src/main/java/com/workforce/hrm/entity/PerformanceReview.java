package com.workforce.hrm.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/**
 * Stored performance-review records. This is intentionally data-only at this
 * stage so the reports API never invents performance results when no review
 * cycle has been configured yet.
 */
@Entity
@Table(name = "performance_reviews")
public class PerformanceReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long performanceReviewId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, length = 160)
    private String cycleName;

    @Column(nullable = false)
    private LocalDate reviewDate;

    @Column(precision = 4, scale = 2)
    private BigDecimal rating;

    @Column(nullable = false, length = 40)
    private String status;

    @Column(length = 2000)
    private String feedback;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getPerformanceReviewId() { return performanceReviewId; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public String getCycleName() { return cycleName; }
    public void setCycleName(String cycleName) { this.cycleName = cycleName; }
    public LocalDate getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
