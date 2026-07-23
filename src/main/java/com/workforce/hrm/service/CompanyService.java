package com.workforce.hrm.service;

import com.workforce.hrm.dto.request.CompanyRequestDTO;
import com.workforce.hrm.dto.response.CompanyResponseDTO;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CompanyService {

	CompanyResponseDTO createCompany(CompanyRequestDTO request);

	Page<CompanyResponseDTO> getAllCompanies(Pageable pageable);

	CompanyResponseDTO getCompanyById(Long id);

	CompanyResponseDTO updateCompany(Long id, CompanyRequestDTO request);

	void deleteCompany(Long id);

	List<CompanyResponseDTO> getAllCompanies();
}