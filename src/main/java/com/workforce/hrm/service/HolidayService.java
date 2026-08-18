package com.workforce.hrm.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.workforce.hrm.dto.request.HolidayRequestDTO;
import com.workforce.hrm.dto.response.HolidayResponseDTO;

public interface HolidayService {

    // =========================================================
    // CREATE HOLIDAY
    // =========================================================

    HolidayResponseDTO createHoliday(
            HolidayRequestDTO request);


    // =========================================================
    // GET ALL HOLIDAYS
    // Tenant-aware
    // =========================================================

    List<HolidayResponseDTO> getAllHolidays();


    // =========================================================
    // GET ALL HOLIDAYS - PAGINATION
    // Tenant-aware
    // =========================================================

    Page<HolidayResponseDTO> getAllHolidays(
            Pageable pageable);


    // =========================================================
    // GET HOLIDAY BY ID
    // Tenant-aware
    // =========================================================

    HolidayResponseDTO getHolidayById(
            Long holidayId);


    // =========================================================
    // UPDATE HOLIDAY
    // =========================================================

    HolidayResponseDTO updateHoliday(
            Long holidayId,
            HolidayRequestDTO request);


    // =========================================================
    // DELETE HOLIDAY
    // =========================================================

    void deleteHoliday(
            Long holidayId);


    // =========================================================
    // GET HOLIDAYS BY YEAR
    // Tenant-aware
    // =========================================================

    List<HolidayResponseDTO> getHolidaysByYear(
            Integer year);


    // =========================================================
    // GET UPCOMING HOLIDAYS
    // Tenant-aware
    // =========================================================

    List<HolidayResponseDTO> getUpcomingHolidays(
            int limit);
}