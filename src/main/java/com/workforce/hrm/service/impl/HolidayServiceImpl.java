package com.workforce.hrm.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.workforce.hrm.entity.Holiday;
import com.workforce.hrm.repository.HolidayRepository;
import com.workforce.hrm.service.HolidayService;

@Service
public class HolidayServiceImpl implements HolidayService {

	@Autowired
	private HolidayRepository holidayRepository;

	@Override
	public Holiday createHoliday(Holiday holiday) {
		return holidayRepository.save(holiday);
	}

	@Override
	public Page<Holiday> getAllHolidays(Pageable pageable) {
		return holidayRepository.findAll(pageable);
	}

	@Override
	public Holiday getHolidayById(Long id) {
		return holidayRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Holiday not found with id: " + id));
	}

	@Override
	public Holiday updateHoliday(Long id, Holiday holiday) {

		Holiday existingHoliday = getHolidayById(id);

		existingHoliday.setHolidayName(holiday.getHolidayName());
		existingHoliday.setHolidayDate(holiday.getHolidayDate());
		existingHoliday.setDescription(holiday.getDescription());

		return holidayRepository.save(existingHoliday);
	}

	@Override
	public void deleteHoliday(Long id) {
		holidayRepository.deleteById(id);
	}

	@Override
	public List<Holiday> upcomingHolidays() {
	    return holidayRepository.upcomingHolidays(PageRequest.of(0, 5));
	}

	@Override
	public Long totalHolidays() {
		return holidayRepository.totalHolidays();
	}
}