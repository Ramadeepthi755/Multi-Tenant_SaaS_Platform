package com.workforce.hrm.repository;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.workforce.hrm.entity.Holiday;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {

    long countByActiveTrue();

    List<Holiday> findByHolidayDateBetween(LocalDate start, LocalDate end);

    @Query("""
        SELECT h
        FROM Holiday h
        WHERE h.holidayDate >= CURRENT_DATE
        ORDER BY h.holidayDate
    """)
    List<Holiday> upcomingHolidays(Pageable pageable);

    @Query("""
        SELECT COUNT(h)
        FROM Holiday h
        WHERE YEAR(h.holidayDate) = YEAR(CURRENT_DATE)
    """)
    Long totalHolidays();
}