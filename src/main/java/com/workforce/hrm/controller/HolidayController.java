package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.request.HolidayRequestDTO;
import com.workforce.hrm.dto.response.HolidayResponseDTO;
import com.workforce.hrm.service.HolidayService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/holidays")
public class HolidayController {

    private final HolidayService holidayService;

    public HolidayController(
            HolidayService holidayService) {

        this.holidayService = holidayService;
    }


    // =========================================================
    // CREATE HOLIDAY
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAuthority('HOLIDAY_CREATE')")
    public ResponseEntity<HolidayResponseDTO>
            createHoliday(
                    @Valid @RequestBody
                    HolidayRequestDTO request) {

        HolidayResponseDTO response =
                holidayService.createHoliday(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // GET ALL HOLIDAYS
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAuthority('HOLIDAY_READ')")
    public ResponseEntity<List<HolidayResponseDTO>>
            getAllHolidays() {

        List<HolidayResponseDTO> holidays =
                holidayService.getAllHolidays();

        return ResponseEntity.ok(holidays);
    }


    // =========================================================
    // GET HOLIDAYS WITH PAGINATION
    //
    // Example:
    // /api/holidays/page?page=0&size=10
    // =========================================================

    @GetMapping("/page")
    @PreAuthorize("hasAuthority('HOLIDAY_READ')")
    public ResponseEntity<Page<HolidayResponseDTO>>
            getAllHolidaysPaginated(

                    @RequestParam(
                            defaultValue = "0")
                    int page,

                    @RequestParam(
                            defaultValue = "10")
                    int size,

                    @RequestParam(
                            defaultValue = "holidayDate")
                    String sortBy,

                    @RequestParam(
                            defaultValue = "asc")
                    String direction) {

        // Prevent invalid pagination values
        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = 10;
        }

        if (size > 100) {
            size = 100;
        }

        Sort sort =
                direction.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        sort);

        Page<HolidayResponseDTO> holidays =
                holidayService
                        .getAllHolidays(pageable);

        return ResponseEntity.ok(holidays);
    }


    // =========================================================
    // GET HOLIDAY BY ID
    // =========================================================

    @GetMapping("/{holidayId}")
    @PreAuthorize("hasAuthority('HOLIDAY_READ')")
    public ResponseEntity<HolidayResponseDTO>
            getHolidayById(
                    @PathVariable Long holidayId) {

        HolidayResponseDTO response =
                holidayService
                        .getHolidayById(holidayId);

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // GET HOLIDAYS BY YEAR
    //
    // Example:
    // /api/holidays/year/2026
    // =========================================================

    @GetMapping("/year/{year}")
    @PreAuthorize("hasAuthority('HOLIDAY_READ')")
    public ResponseEntity<List<HolidayResponseDTO>>
            getHolidaysByYear(
                    @PathVariable Integer year) {

        List<HolidayResponseDTO> holidays =
                holidayService
                        .getHolidaysByYear(year);

        return ResponseEntity.ok(holidays);
    }


    // =========================================================
    // GET UPCOMING HOLIDAYS
    //
    // Example:
    // /api/holidays/upcoming?limit=5
    // =========================================================

    @GetMapping("/upcoming")
    @PreAuthorize("hasAuthority('HOLIDAY_READ')")
    public ResponseEntity<List<HolidayResponseDTO>>
            getUpcomingHolidays(

                    @RequestParam(
                            defaultValue = "5")
                    int limit) {

        List<HolidayResponseDTO> holidays =
                holidayService
                        .getUpcomingHolidays(limit);

        return ResponseEntity.ok(holidays);
    }


    // =========================================================
    // UPDATE HOLIDAY
    // =========================================================

    @PutMapping("/{holidayId}")
    @PreAuthorize("hasAuthority('HOLIDAY_UPDATE')")
    public ResponseEntity<HolidayResponseDTO>
            updateHoliday(

                    @PathVariable Long holidayId,

                    @Valid @RequestBody
                    HolidayRequestDTO request) {

        HolidayResponseDTO response =
                holidayService
                        .updateHoliday(
                                holidayId,
                                request);

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // DELETE HOLIDAY
    // =========================================================

    @DeleteMapping("/{holidayId}")
    @PreAuthorize("hasAuthority('HOLIDAY_DELETE')")
    public ResponseEntity<Void>
            deleteHoliday(
                    @PathVariable Long holidayId) {

        holidayService
                .deleteHoliday(holidayId);

        return ResponseEntity
                .noContent()
                .build();
    }
}