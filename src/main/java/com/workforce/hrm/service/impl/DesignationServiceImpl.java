package com.workforce.hrm.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workforce.hrm.entity.Designation;
import com.workforce.hrm.repository.DesignationRepository;
import com.workforce.hrm.service.DesignationService;

@Service
public class DesignationServiceImpl implements DesignationService {

	
	private DesignationRepository designationRepository;

	@Override
	public Designation createDesignation(Designation designation) {

		if (designationRepository.existsByDesignationCode(designation.getDesignationCode())) {

			throw new RuntimeException("Designation Code Already Exists");
		}

		return designationRepository.save(designation);
	}

	@Override
	public List<Designation> getAllDesignations() {
		return designationRepository.findAll();
	}

	@Override
	public Designation getDesignationById(Long id) {

		return designationRepository.findById(id).orElseThrow(() -> new RuntimeException("Designation Not Found"));
	}

	@Override
	public Designation updateDesignation(Long id, Designation designation) {

		Designation existingDesignation = designationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Designation Not Found"));

		existingDesignation.setDesignationCode(designation.getDesignationCode());

		existingDesignation.setDesignationName(designation.getDesignationName());

		existingDesignation.setDescription(designation.getDescription());

		existingDesignation.setStatus(designation.getStatus());

		return designationRepository.save(existingDesignation);
	}

	@Override
	public void deleteDesignation(Long id) {

		Designation designation = designationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Designation Not Found"));

		designationRepository.delete(designation);
	}
	@Override
	public List<Designation> getByDepartment(Long departmentId) {
	    return designationRepository.findByDepartmentDepartmentId(departmentId);
	}
}