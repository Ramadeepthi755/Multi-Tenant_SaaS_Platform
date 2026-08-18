package com.workforce.hrm.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.Holiday;

public interface HolidayRepository
        extends JpaRepository<Holiday, Long> {

    // =========================================================
    // COMPANY / TENANT - PAGINATED HOLIDAYS
    // =========================================================

    Page<Holiday> findByCompanyId(
            Long companyId,
            Pageable pageable);


    // =========================================================
    // COMPANY / TENANT - HOLIDAY BY ID
    // =========================================================

    Optional<Holiday> findByHolidayIdAndCompanyId(
            Long holidayId,
            Long companyId);


    // =========================================================
    // COMPANY / TENANT - ALL HOLIDAYS
    // =========================================================

    List<Holiday> findByCompanyId(
            Long companyId);


    // =========================================================
    // COMPANY / TENANT - YEAR
    // =========================================================

    List<Holiday> findByYearAndCompanyId(
            Integer year,
            Long companyId);


    // =========================================================
    // COMPANY / TENANT - DATE
    // =========================================================

    Optional<Holiday> findByHolidayDateAndCompanyId(
            LocalDate holidayDate,
            Long companyId);


    // =========================================================
    // DUPLICATE HOLIDAY CHECK
    // =========================================================

    boolean existsByHolidayDateAndCompanyId(
            LocalDate holidayDate,
            Long companyId);


    // =========================================================
    // GLOBAL UPCOMING HOLIDAYS
    // SUPER_ADMIN
    // =========================================================

    @Query("""
            SELECT h
            FROM Holiday h
            WHERE h.holidayDate >= CURRENT_DATE
            AND h.active = true
            ORDER BY h.holidayDate ASC
            """)
    List<Holiday> upcomingHolidays(
            Pageable pageable);


    // =========================================================
    // COMPANY UPCOMING HOLIDAYS
    // COMPANY_ADMIN / HR / MANAGER / EMPLOYEE
    // =========================================================

    @Query("""
            SELECT h
            FROM Holiday h
            WHERE h.company.id = :companyId
            AND h.holidayDate >= CURRENT_DATE
            AND h.active = true
            ORDER BY h.holidayDate ASC
            """)
    List<Holiday> upcomingHolidaysByCompanyId(
            @Param("companyId") Long companyId,
            Pageable pageable);


    // =========================================================
    // GLOBAL TOTAL HOLIDAYS
    // SUPER_ADMIN DASHBOARD
    // =========================================================

    @Query("""
            SELECT COUNT(h)
            FROM Holiday h
            WHERE h.active = true
            """)
    Long totalHolidays();


    // =========================================================
    // COMPANY TOTAL HOLIDAYS
    // COMPANY DASHBOARD
    // =========================================================

    @Query("""
            SELECT COUNT(h)
            FROM Holiday h
            WHERE h.company.id = :companyId
            AND h.active = true
            """)
    Long totalHolidaysByCompanyId(
            @Param("companyId") Long companyId);


    // =========================================================
    // GLOBAL HOLIDAYS BY YEAR
    // =========================================================

    List<Holiday> findByYear(
            Integer year);


    // =========================================================
    // GLOBAL HOLIDAY BY DATE
    // =========================================================

    Optional<Holiday> findByHolidayDate(
            LocalDate holidayDate);
}