package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.entity.Holiday;
import com.workforce.hrm.service.HolidayService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/holidays")
@Tag(name = "Holiday Management", description = "Holiday CRUD Operations")
public class HolidayController {

	private HolidayService holidayService;

	@Operation(summary = "Create Holiday")
	@PostMapping
	public Holiday createHoliday(@Valid @RequestBody Holiday holiday) {

		return holidayService.createHoliday(holiday);
	}

	@Operation(summary = "Get All Holidays")
	@GetMapping
	public Page<Holiday> getAll(Pageable pageable) {

		return holidayService.getAllHolidays(pageable);
	}

	@Operation(summary = "Get Holiday By ID")
	@GetMapping("/{id}")
	public Holiday getHoliday(@PathVariable Long id) {

		return holidayService.getHolidayById(id);
	}

	@Operation(summary = "Update Holiday")
	@PutMapping("/{id}")
	public Holiday updateHoliday(@Valid @PathVariable Long id, @RequestBody Holiday holiday) {

		return holidayService.updateHoliday(id, holiday);
	}

	@Operation(summary = "Delete Holiday")
	@DeleteMapping("/{id}")
	public String deleteHoliday(@PathVariable Long id) {

		holidayService.deleteHoliday(id);

		return "Holiday Deleted Successfully";
	}

	@Operation(summary = "Upcoming Holidays")
	@GetMapping("/upcoming")
	public List<Holiday> upcoming() {

		return holidayService.upcomingHolidays();
	}

	@Operation(summary = "Total Holidays")
	@GetMapping("/count")
	public Long totalHolidays() {

		return holidayService.totalHolidays();
	}

}