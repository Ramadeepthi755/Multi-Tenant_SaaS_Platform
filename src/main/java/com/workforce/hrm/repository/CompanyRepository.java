package com.workforce.hrm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.workforce.hrm.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {
	boolean existsByCompanyCode(String companyCode);
	boolean existsByEmail(String email);
	boolean existsByCompanyName(String companyName);
}