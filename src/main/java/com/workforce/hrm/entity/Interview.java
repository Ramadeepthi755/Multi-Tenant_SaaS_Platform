package com.workforce.hrm.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.workforce.hrm.enums.InterviewStatus;
import com.workforce.hrm.enums.InterviewType;

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
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long interviewId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "interviewer_id", nullable = false)
    private User interviewer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewType interviewType;

    @Column(nullable = false)
    private LocalDate interviewDate;

    @Column(nullable = false)
    private LocalTime interviewTime;

    @Column(length = 600)
    private String meetingLink;

    @Column(length = 400)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @Column(length = 4000)
    private String feedback;

    private Integer rating;

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

    public Long getInterviewId() { return interviewId; }
    public Candidate getCandidate() { return candidate; }
    public void setCandidate(Candidate candidate) { this.candidate = candidate; }
    public User getInterviewer() { return interviewer; }
    public void setInterviewer(User interviewer) { this.interviewer = interviewer; }
    public InterviewType getInterviewType() { return interviewType; }
    public void setInterviewType(InterviewType interviewType) { this.interviewType = interviewType; }
    public LocalDate getInterviewDate() { return interviewDate; }
    public void setInterviewDate(LocalDate interviewDate) { this.interviewDate = interviewDate; }
    public LocalTime getInterviewTime() { return interviewTime; }
    public void setInterviewTime(LocalTime interviewTime) { this.interviewTime = interviewTime; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public InterviewStatus getStatus() { return status; }
    public void setStatus(InterviewStatus status) { this.status = status; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
