package com.workforce.hrm.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.workforce.hrm.entity.Holiday;
import com.workforce.hrm.repository.HolidayRepository;

public interface HolidayService {

    Holiday createHoliday(Holiday holiday);

    Page<Holiday> getAllHolidays(Pageable pageable);

    Holiday getHolidayById(Long id);

    Holiday updateHoliday(Long id, Holiday holiday);

    void deleteHoliday(Long id);

    List<Holiday> upcomingHolidays();

    Long totalHolidays();
}