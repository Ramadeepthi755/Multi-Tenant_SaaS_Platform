package com.workforce.hrm.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.Interview;
import com.workforce.hrm.enums.InterviewStatus;
import com.workforce.hrm.enums.InterviewType;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    @Query("""
            select i from Interview i
            where (:companyId is null or i.company.id = :companyId)
              and (:interviewType is null or i.interviewType = :interviewType)
              and (:status is null or i.status = :status)
              and (:keyword is null or lower(i.candidate.fullName) like lower(concat('%', :keyword, '%')))
            """)
    Page<Interview> search(@Param("companyId") Long companyId,
                           @Param("interviewType") InterviewType interviewType,
                           @Param("status") InterviewStatus status,
                           @Param("keyword") String keyword,
                           Pageable pageable);

    long countByCompany_IdAndInterviewDate(Long companyId, LocalDate interviewDate);
}
