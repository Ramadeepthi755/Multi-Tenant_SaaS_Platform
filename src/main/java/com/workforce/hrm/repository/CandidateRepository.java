package com.workforce.hrm.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.Candidate;
import com.workforce.hrm.enums.CandidateStatus;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    @Query("""
            select c from Candidate c
            where (:companyId is null or c.company.id = :companyId)
              and (:status is null or c.status = :status)
              and (:fromDate is null or c.createdAt >= :fromDate)
              and (:toDateExclusive is null or c.createdAt < :toDateExclusive)
              and (:keyword is null or lower(c.fullName) like lower(concat('%', :keyword, '%'))
                   or lower(c.email) like lower(concat('%', :keyword, '%')))
            """)
    Page<Candidate> search(@Param("companyId") Long companyId,
                           @Param("status") CandidateStatus status,
                           @Param("keyword") String keyword,
                           @Param("fromDate") LocalDateTime fromDate,
                           @Param("toDateExclusive") LocalDateTime toDateExclusive,
                           Pageable pageable);

    long countByCompany_Id(Long companyId);
    long countByCompany_IdAndStatus(Long companyId, CandidateStatus status);
}
