package com.workforce.hrm.service;

import java.util.List;
import com.workforce.hrm.entity.Designation;

public interface DesignationService {

	Designation createDesignation(Designation designation);

	List<Designation> getAllDesignations();

	Designation getDesignationById(Long id);

	Designation updateDesignation(Long id, Designation designation);

	void deleteDesignation(Long id);
	List<Designation> getByDepartment(Long departmentId);
}