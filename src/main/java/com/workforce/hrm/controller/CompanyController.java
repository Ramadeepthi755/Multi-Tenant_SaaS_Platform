package com.workforce.hrm.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.entity.Company;
import com.workforce.hrm.service.CompanyService;

import jakarta.validation.Valid;

import com.workforce.hrm.dto.request.CompanyRequestDTO;
import com.workforce.hrm.dto.response.CompanyResponseDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/companies")
@Tag(name = "Company Management", description = "Company CRUD Operations")

public class CompanyController {

	@Autowired
	private CompanyService companyService;

	@Operation(summary = "Create Company", description = "Create a new company")
	@PostMapping
	public CompanyResponseDTO createCompany(@Valid @RequestBody CompanyRequestDTO dto) {

		return companyService.createCompany(dto);
	}

	@Operation(summary = "Get All Companies", description = "Fetch all companies with pagination")
	@GetMapping
	public Page<CompanyResponseDTO> getAllCompanies(Pageable pageable) {

		return companyService.getAllCompanies(pageable);
	}

	@Operation(summary = "Get Company By ID")
	@GetMapping("/{id}")
	public CompanyResponseDTO getCompanyById(@PathVariable Long id) {

		return companyService.getCompanyById(id);
	}

	@Operation(summary = "Update Company")
	@PutMapping("/{id}")
	public CompanyResponseDTO updateCompany(@Valid @PathVariable Long id, @RequestBody CompanyRequestDTO request) {

		return companyService.updateCompany(id, request);
	}

	@Operation(summary = "Delete Company")
	@DeleteMapping("/{id}")
	public String deleteCompany(@PathVariable Long id) {

		companyService.deleteCompany(id);

		return "Company Deleted Successfully";
	}
}