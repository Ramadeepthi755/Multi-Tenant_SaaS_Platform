package com.workforce.hrm.service.impl;

import com.workforce.hrm.dto.request.CompanyRequestDTO;
import com.workforce.hrm.dto.response.CompanyResponseDTO;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.exception.ResourceNotFoundException;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.service.CompanyService;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CompanyServiceImpl implements CompanyService {

	private static final Logger log = LoggerFactory.getLogger(CompanyServiceImpl.class);

	@Autowired
	private CompanyRepository companyRepository;

	@Override
	public CompanyResponseDTO createCompany(CompanyRequestDTO request) {

		log.info("Creating Company : {}", request.getCompanyName());

		if (companyRepository.existsByCompanyCode(request.getCompanyCode())) {

			log.warn("Company Code Already Exists : {}", request.getCompanyCode());

			throw new RuntimeException("Company Code Already Exists");
		}

		Company company = new Company();

		company.setCompanyName(request.getCompanyName());
		company.setCompanyCode(request.getCompanyCode());
		company.setEmail(request.getEmail());
		company.setPhone(request.getPhone());
		company.setActive(true);

		Company savedCompany = companyRepository.save(company);

		log.info("Company Created Successfully. ID : {}", savedCompany.getId());

		CompanyResponseDTO response = new CompanyResponseDTO();

		response.setId(savedCompany.getId());
		response.setCompanyName(savedCompany.getCompanyName());
		response.setCompanyCode(savedCompany.getCompanyCode());
		response.setEmail(savedCompany.getEmail());
		response.setPhone(savedCompany.getPhone());

		return response;
	}

	@Override
	public Page<CompanyResponseDTO> getAllCompanies(Pageable pageable) {

		log.info("Fetching Companies Page : {}", pageable.getPageNumber());

		Page<Company> companies = companyRepository.findAll(pageable);

		return companies.map(company -> {

			CompanyResponseDTO response = new CompanyResponseDTO();

			response.setId(company.getId());
			response.setCompanyName(company.getCompanyName());
			response.setCompanyCode(company.getCompanyCode());
			response.setEmail(company.getEmail());
			response.setPhone(company.getPhone());

			return response;
		});
	}

	@Override
	public CompanyResponseDTO getCompanyById(Long id) {

		log.info("Fetching Company ID : {}", id);

		Company company = companyRepository.findById(id).orElseThrow(() -> {

			log.error("Company Not Found ID : {}", id);

			return new ResourceNotFoundException("Company Not Found");
		});

		log.info("Company Found : {}", company.getCompanyName());

		CompanyResponseDTO response = new CompanyResponseDTO();

		response.setId(company.getId());
		response.setCompanyName(company.getCompanyName());
		response.setCompanyCode(company.getCompanyCode());
		response.setEmail(company.getEmail());
		response.setPhone(company.getPhone());

		return response;
	}

	@Override
	public CompanyResponseDTO updateCompany(Long id, CompanyRequestDTO request) {

		log.info("Updating Company ID : {}", id);

		Company company = companyRepository.findById(id).orElseThrow(() -> {

			log.error("Company Not Found ID : {}", id);

			return new ResourceNotFoundException("Company Not Found");
		});

		company.setCompanyName(request.getCompanyName());
		company.setCompanyCode(request.getCompanyCode());
		company.setEmail(request.getEmail());
		company.setPhone(request.getPhone());

		Company updatedCompany = companyRepository.save(company);

		log.info("Company Updated Successfully. ID : {}", updatedCompany.getId());

		CompanyResponseDTO response = new CompanyResponseDTO();

		response.setId(updatedCompany.getId());
		response.setCompanyName(updatedCompany.getCompanyName());
		response.setCompanyCode(updatedCompany.getCompanyCode());
		response.setEmail(updatedCompany.getEmail());
		response.setPhone(updatedCompany.getPhone());

		return response;
	}

	@Override
	public void deleteCompany(Long id) {

		log.warn("Deleting Company ID : {}", id);

		Company company = companyRepository.findById(id).orElseThrow(() -> {

			log.error("Company Not Found ID : {}", id);

			return new ResourceNotFoundException("Company Not Found");
		});

		companyRepository.delete(company);

		log.info("Company Deleted Successfully. ID : {}", id);
	}

	@Override
	public List<CompanyResponseDTO> getAllCompanies() {
		// TODO Auto-generated method stub
		return null;
	}
}