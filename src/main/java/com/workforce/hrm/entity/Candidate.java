package com.workforce.hrm.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.workforce.hrm.enums.CandidateStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long candidateId;

    @Column(nullable = false, length = 160)
    private String fullName;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(length = 40)
    private String phone;

    @Column(length = 160)
    private String experience;

    @Column(length = 2000)
    private String skills;

    @Column(length = 180)
    private String currentCompany;

    @Column(precision = 14, scale = 2)
    private BigDecimal expectedSalary;

    @Column(length = 80)
    private String noticePeriod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CandidateStatus status = CandidateStatus.APPLIED;

    @Column(length = 300)
    private String resumeFileName;

    @Column(length = 300)
    private String resumeOriginalFileName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getCandidateId() { return candidateId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getCurrentCompany() { return currentCompany; }
    public void setCurrentCompany(String currentCompany) { this.currentCompany = currentCompany; }
    public BigDecimal getExpectedSalary() { return expectedSalary; }
    public void setExpectedSalary(BigDecimal expectedSalary) { this.expectedSalary = expectedSalary; }
    public String getNoticePeriod() { return noticePeriod; }
    public void setNoticePeriod(String noticePeriod) { this.noticePeriod = noticePeriod; }
    public CandidateStatus getStatus() { return status; }
    public void setStatus(CandidateStatus status) { this.status = status; }
    public String getResumeFileName() { return resumeFileName; }
    public void setResumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; }
    public String getResumeOriginalFileName() { return resumeOriginalFileName; }
    public void setResumeOriginalFileName(String resumeOriginalFileName) { this.resumeOriginalFileName = resumeOriginalFileName; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
