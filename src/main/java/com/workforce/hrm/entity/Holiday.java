package com.workforce.hrm.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "holidays")
public class Holiday {

    // =========================================================
    // PRIMARY KEY
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long holidayId;


    // =========================================================
    // HOLIDAY DETAILS
    // =========================================================

    @Column(nullable = false)
    private String holidayName;

    @Column(nullable = false)
    private LocalDate holidayDate;

    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private String holidayType;

    @Column(name = "holiday_year", nullable = false)
    private Integer year;

    @Column(nullable = false)
    private String status;


    // =========================================================
    // COMPANY / TENANT
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "company_id",
            nullable = false
    )
    private Company company;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Holiday() {
    }


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public Long getHolidayId() {
        return holidayId;
    }

    public void setHolidayId(Long holidayId) {
        this.holidayId = holidayId;
    }

    public String getHolidayName() {
        return holidayName;
    }

    public void setHolidayName(String holidayName) {
        this.holidayName = holidayName;
    }

    public LocalDate getHolidayDate() {
        return holidayDate;
    }

    public void setHolidayDate(LocalDate holidayDate) {
        this.holidayDate = holidayDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getHolidayType() {
        return holidayType;
    }

    public void setHolidayType(String holidayType) {
        this.holidayType = holidayType;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}