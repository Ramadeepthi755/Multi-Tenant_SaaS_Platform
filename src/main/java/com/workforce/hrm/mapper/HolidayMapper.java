package com.workforce.hrm.mapper;

import com.workforce.hrm.dto.request.HolidayRequestDTO;
import com.workforce.hrm.dto.response.HolidayResponseDTO;
import com.workforce.hrm.entity.Holiday;

public class HolidayMapper {

    private HolidayMapper() {
        // Utility class
    }

    // =========================================================
    // REQUEST DTO -> ENTITY
    // =========================================================

    public static Holiday toEntity(
            HolidayRequestDTO dto) {

        if (dto == null) {
            return null;
        }

        Holiday holiday = new Holiday();

        holiday.setHolidayName(
                dto.getHolidayName());

        holiday.setHolidayDate(
                dto.getHolidayDate());

        holiday.setDescription(
                dto.getDescription());

        holiday.setActive(
                dto.isActive());

        holiday.setHolidayType(
                dto.getHolidayType());

        holiday.setYear(
                dto.getYear());

        holiday.setStatus(
                dto.getStatus());

        /*
         * IMPORTANT:
         *
         * Company is NOT assigned here.
         *
         * HolidayServiceImpl will assign company
         * using the authenticated user's company:
         *
         * SecurityUtils.getCurrentCompanyId()
         *
         * This prevents frontend from selecting
         * another tenant/company.
         */

        return holiday;
    }


    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    public static HolidayResponseDTO toResponseDTO(
            Holiday holiday) {

        if (holiday == null) {
            return null;
        }

        HolidayResponseDTO dto =
                new HolidayResponseDTO();

        // -----------------------------------------------------
        // Holiday details
        // -----------------------------------------------------

        dto.setHolidayId(
                holiday.getHolidayId());

        dto.setHolidayName(
                holiday.getHolidayName());

        dto.setHolidayDate(
                holiday.getHolidayDate());

        dto.setDescription(
                holiday.getDescription());

        dto.setActive(
                holiday.isActive());

        dto.setHolidayType(
                holiday.getHolidayType());

        dto.setYear(
                holiday.getYear());

        dto.setStatus(
                holiday.getStatus());


        // -----------------------------------------------------
        // Company / Tenant details
        // -----------------------------------------------------

        if (holiday.getCompany() != null) {

            dto.setCompanyId(
                    holiday.getCompany()
                            .getId());

            dto.setCompanyName(
                    holiday.getCompany()
                            .getCompanyName());
        }

        return dto;
    }


    // =========================================================
    // UPDATE EXISTING ENTITY
    // =========================================================

    public static void updateEntity(
            Holiday holiday,
            HolidayRequestDTO dto) {

        if (holiday == null || dto == null) {
            return;
        }

        holiday.setHolidayName(
                dto.getHolidayName());

        holiday.setHolidayDate(
                dto.getHolidayDate());

        holiday.setDescription(
                dto.getDescription());

        holiday.setActive(
                dto.isActive());

        holiday.setHolidayType(
                dto.getHolidayType());

        holiday.setYear(
                dto.getYear());

        holiday.setStatus(
                dto.getStatus());

        /*
         * IMPORTANT:
         *
         * Do NOT update company here.
         *
         * Existing Holiday:
         *
         * Company A Holiday
         *      ↓
         * UPDATE request
         *      ↓
         * Still Company A
         *
         * Tenant ownership cannot be changed
         * through normal update request.
         */
    }
}