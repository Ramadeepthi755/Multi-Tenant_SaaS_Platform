package com.workforce.hrm.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class HolidayRequestDTO {

    // =========================================================
    // HOLIDAY DETAILS
    // =========================================================

    @NotBlank(message = "Holiday Name is required")
    private String holidayName;

    @NotNull(message = "Holiday Date is required")
    private LocalDate holidayDate;

    private String description;

    private boolean active = true;


    // =========================================================
    // HOLIDAY TYPE
    // =========================================================

    @NotBlank(message = "Holiday Type is required")
    private String holidayType;


    // =========================================================
    // YEAR
    // =========================================================

    @NotNull(message = "Year is required")
    private Integer year;


    // =========================================================
    // STATUS
    // =========================================================

    @NotBlank(message = "Status is required")
    private String status;


    // =========================================================
    // COMPANY
    // =========================================================

    /*
     * Used only by SUPER_ADMIN.
     *
     * Normal company users must not be able
     * to choose another company.
     */
    private Long companyId;


    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

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


    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }
}