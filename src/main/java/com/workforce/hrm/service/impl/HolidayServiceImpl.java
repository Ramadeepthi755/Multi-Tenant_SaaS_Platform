package com.workforce.hrm.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.HolidayRequestDTO;
import com.workforce.hrm.dto.response.HolidayResponseDTO;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Holiday;
import com.workforce.hrm.mapper.HolidayMapper;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.HolidayRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.HolidayService;
import com.workforce.hrm.service.AuditLogService;

@Service
@Transactional
public class HolidayServiceImpl implements HolidayService {

    private final HolidayRepository holidayRepository;
    private final CompanyRepository companyRepository;
    private final AuditLogService auditLogService;

    public HolidayServiceImpl(
            HolidayRepository holidayRepository,
            CompanyRepository companyRepository,
            AuditLogService auditLogService) {

        this.holidayRepository = holidayRepository;
        this.companyRepository = companyRepository;
        this.auditLogService = auditLogService;
    }

    // =========================================================
    // CREATE HOLIDAY
    // =========================================================

    @Override
    public HolidayResponseDTO createHoliday(
            HolidayRequestDTO request) {

        validateRequest(request);


        // =========================================================
        // RESOLVE COMPANY
        // =========================================================

        Company company;


        /*
         * SUPER_ADMIN can create holidays
         * for any company.
         */
        if (SecurityUtils.isSuperAdmin()) {

            if (request.getCompanyId() == null) {

                throw new RuntimeException(
                        "Company is required for Super Admin");
            }


            company =
                    companyRepository
                            .findById(
                                    request.getCompanyId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Company Not Found"));
        }


        /*
         * Normal company users automatically
         * use their authenticated company.
         */
        else {

            Long companyId =
                    getRequiredCurrentCompanyId();


            company =
                    companyRepository
                            .findById(companyId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Company Not Found"));
        }


        // =========================================================
        // DUPLICATE CHECK
        // =========================================================

        boolean exists =
                holidayRepository
                        .existsByHolidayDateAndCompanyId(
                                request.getHolidayDate(),
                                company.getId());


        if (exists) {

            throw new RuntimeException(
                    "Holiday already exists on "
                            + request.getHolidayDate()
                            + " for this company");
        }


        // =========================================================
        // CREATE ENTITY
        // =========================================================

        Holiday holiday =
                HolidayMapper.toEntity(
                        request);


        /*
         * Company ownership is always assigned
         * by the backend.
         */
        holiday.setCompany(company);


        Holiday savedHoliday =
                holidayRepository.save(
                        holiday);


        // =========================================================
        // AUDIT LOG
        // =========================================================

        auditLogService.saveLog(
                "CREATE",
                "HOLIDAY",
                "Created Holiday : "
                        + savedHoliday.getHolidayName(),
                "SYSTEM");


        return HolidayMapper.toResponseDTO(
                savedHoliday);
    }

    // =========================================================
    // GET ALL HOLIDAYS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<HolidayResponseDTO> getAllHolidays() {

        List<Holiday> holidays;

        if (SecurityUtils.isSuperAdmin()) {

            holidays =
                    holidayRepository.findAll();

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            holidays =
                    holidayRepository
                            .findByCompanyId(companyId);
        }

        return convertToResponseList(holidays);
    }


    // =========================================================
    // GET ALL HOLIDAYS - PAGINATION
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public Page<HolidayResponseDTO> getAllHolidays(
            Pageable pageable) {

        Page<Holiday> holidays;

        if (SecurityUtils.isSuperAdmin()) {

            holidays =
                    holidayRepository
                            .findAll(pageable);

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            holidays =
                    holidayRepository
                            .findByCompanyId(
                                    companyId,
                                    pageable);
        }

        return holidays.map(
                HolidayMapper::toResponseDTO);
    }


    // =========================================================
    // GET HOLIDAY BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public HolidayResponseDTO getHolidayById(
            Long holidayId) {

        Holiday holiday =
                getHolidayAndValidateAccess(
                        holidayId);

        return HolidayMapper.toResponseDTO(
                holiday);
    }


    // =========================================================
    // UPDATE HOLIDAY
    // =========================================================

    @Override
    public HolidayResponseDTO updateHoliday(
            Long holidayId,
            HolidayRequestDTO request) {

        validateRequest(request);

        Holiday existingHoliday =
                getHolidayAndValidateAccess(
                        holidayId);

        /*
         * Check whether another holiday already exists
         * on requested date for same company.
         *
         * We must allow the current holiday to retain
         * its own date.
         */

        Long companyId =
                getHolidayCompanyId(
                        existingHoliday);

        holidayRepository
                .findByHolidayDateAndCompanyId(
                        request.getHolidayDate(),
                        companyId)
                .ifPresent(foundHoliday -> {

                    if (!foundHoliday
                            .getHolidayId()
                            .equals(holidayId)) {

                        throw new RuntimeException(
                                "Another holiday already exists on "
                                        + request.getHolidayDate());
                    }
                });

        /*
         * Mapper updates only holiday information.
         * Company ownership remains unchanged.
         */
        HolidayMapper.updateEntity(
                existingHoliday,
                request);

        Holiday updatedHoliday =
                holidayRepository.save(existingHoliday);

        auditLogService.saveLog(
                "UPDATE",
                "HOLIDAY",
                "Updated Holiday : "
                        + updatedHoliday.getHolidayName(),
                "SYSTEM");

        return HolidayMapper.toResponseDTO(updatedHoliday);
    }


    // =========================================================
    // DELETE HOLIDAY
    // =========================================================

    @Override
    public void deleteHoliday(
            Long holidayId) {

        Holiday holiday =
                getHolidayAndValidateAccess(
                        holidayId);

        holidayRepository.delete(holiday);

        auditLogService.saveLog(
                "DELETE",
                "HOLIDAY",
                "Deleted Holiday : "
                        + holiday.getHolidayName(),
                "SYSTEM");
    }


    // =========================================================
    // GET HOLIDAYS BY YEAR
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<HolidayResponseDTO>
            getHolidaysByYear(
                    Integer year) {

        if (year == null) {

            throw new RuntimeException(
                    "Year is required");
        }

        List<Holiday> holidays;

        if (SecurityUtils.isSuperAdmin()) {

            holidays =
                    holidayRepository
                            .findByYear(year);

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            holidays =
                    holidayRepository
                            .findByYearAndCompanyId(
                                    year,
                                    companyId);
        }

        return convertToResponseList(
                holidays);
    }


    // =========================================================
    // GET UPCOMING HOLIDAYS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<HolidayResponseDTO>
            getUpcomingHolidays(
                    int limit) {

        /*
         * Avoid invalid or extremely large requests.
         */
        if (limit <= 0) {
            limit = 5;
        }

        if (limit > 50) {
            limit = 50;
        }

        Pageable pageable =
                PageRequest.of(
                        0,
                        limit);

        List<Holiday> holidays;

        if (SecurityUtils.isSuperAdmin()) {

            holidays =
                    holidayRepository
                            .upcomingHolidays(
                                    pageable);

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            holidays =
                    holidayRepository
                            .upcomingHolidaysByCompanyId(
                                    companyId,
                                    pageable);
        }

        return convertToResponseList(
                holidays);
    }


    // =========================================================
    // GET HOLIDAY + VALIDATE TENANT
    // =========================================================

    private Holiday getHolidayAndValidateAccess(
            Long holidayId) {

        if (holidayId == null) {

            throw new RuntimeException(
                    "Holiday ID is required");
        }

        /*
         * SUPER_ADMIN can access holidays
         * across all companies.
         */
        if (SecurityUtils.isSuperAdmin()) {

            return holidayRepository
                    .findById(holidayId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Holiday Not Found"));
        }

        Long companyId =
                getRequiredCurrentCompanyId();

        /*
         * Tenant condition is part of database query.
         *
         * Company A cannot retrieve Company B holiday.
         */
        return holidayRepository
                .findByHolidayIdAndCompanyId(
                        holidayId,
                        companyId)
                .orElseThrow(() ->
                        new AccessDeniedException(
                                "Holiday not found or access denied"));
    }


    // =========================================================
    // GET HOLIDAY COMPANY ID
    // =========================================================

    private Long getHolidayCompanyId(
            Holiday holiday) {

        if (holiday.getCompany() == null ||
                holiday.getCompany()
                        .getId() == null) {

            throw new RuntimeException(
                    "Holiday company information not found");
        }

        return holiday
                .getCompany()
                .getId();
    }


    // =========================================================
    // GET CURRENT COMPANY
    // =========================================================

    private Long getRequiredCurrentCompanyId() {

        Long companyId =
                SecurityUtils
                        .getCurrentCompanyId();

        if (companyId == null) {

            throw new AccessDeniedException(
                    "No company assigned to current user");
        }

        return companyId;
    }


    // =========================================================
    // VALIDATE REQUEST
    // =========================================================

    private void validateRequest(
            HolidayRequestDTO request) {

        if (request == null) {

            throw new RuntimeException(
                    "Holiday request is required");
        }

        /*
         * Extra business validation:
         * holiday year should match holidayDate year.
         */

        if (request.getHolidayDate() != null &&
                request.getYear() != null &&
                request.getHolidayDate()
                        .getYear()
                        != request.getYear()) {

            throw new RuntimeException(
                    "Holiday year must match holiday date year");
        }
    }


    // =========================================================
    // ENTITY LIST -> RESPONSE DTO LIST
    // =========================================================

    private List<HolidayResponseDTO>
            convertToResponseList(
                    List<Holiday> holidays) {

        return holidays
                .stream()
                .map(HolidayMapper::toResponseDTO)
                .toList();
    }
}