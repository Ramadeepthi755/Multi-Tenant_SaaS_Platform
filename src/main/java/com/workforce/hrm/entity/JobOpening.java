package com.workforce.hrm.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.workforce.hrm.enums.EmploymentType;
import com.workforce.hrm.enums.JobStatus;

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
@Table(name = "job_openings")
public class JobOpening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    @Column(nullable = false, length = 160)
    private String jobTitle;

    @Column(length = 4000)
    private String description;

    @Column(length = 2000)
    private String requiredSkills;

    @Column(length = 160)
    private String experience;

    @Column(precision = 14, scale = 2)
    private BigDecimal salary;

    @Column(nullable = false)
    private Integer vacancies = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmploymentType employmentType = EmploymentType.FULL_TIME;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

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
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getJobId() { return jobId; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
    public Integer getVacancies() { return vacancies; }
    public void setVacancies(Integer vacancies) { this.vacancies = vacancies; }
    public EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }
    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
