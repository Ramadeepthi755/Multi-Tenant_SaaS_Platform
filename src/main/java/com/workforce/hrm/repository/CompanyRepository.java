package com.workforce.hrm.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

import com.workforce.hrm.entity.Company;
import com.workforce.hrm.enums.CompanyStatus;

public interface CompanyRepository
        extends JpaRepository<Company, Long> {

    boolean existsByCompanyCode(String companyCode);

    boolean existsByEmail(String email);

    boolean existsByCompanyName(String companyName);

    Optional<Company> findByCompanyCode(String companyCode);

    long countByStatus(CompanyStatus status);

    @Query("""
        SELECT c
        FROM Company c
        WHERE LOWER(c.companyName) LIKE
              LOWER(CONCAT('%', :search, '%'))
           OR LOWER(c.companyCode) LIKE
              LOWER(CONCAT('%', :search, '%'))
           OR LOWER(c.email) LIKE
              LOWER(CONCAT('%', :search, '%'))
           OR LOWER(c.phone) LIKE
              LOWER(CONCAT('%', :search, '%'))
    """)
    Page<Company> searchCompanies(
            @Param("search") String search,
            Pageable pageable
    );
}
