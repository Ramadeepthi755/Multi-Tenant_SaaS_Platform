package com.workforce.hrm.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.workforce.hrm.entity.JobOpening;
import com.workforce.hrm.enums.JobStatus;

public interface JobOpeningRepository extends JpaRepository<JobOpening, Long> {

    @Query("""
            select j from JobOpening j
            where (:companyId is null or j.company.id = :companyId)
              and (:departmentId is null or j.department.departmentId = :departmentId)
              and (:status is null or j.status = :status)
              and (:keyword is null or lower(j.jobTitle) like lower(concat('%', :keyword, '%'))
                   or lower(coalesce(j.description, '')) like lower(concat('%', :keyword, '%')))
            """)
    Page<JobOpening> search(@Param("companyId") Long companyId,
                            @Param("departmentId") Long departmentId,
                            @Param("status") JobStatus status,
                            @Param("keyword") String keyword,
                            Pageable pageable);

    long countByCompany_IdAndStatus(Long companyId, JobStatus status);
}
