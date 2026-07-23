package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.entity.Designation;
import com.workforce.hrm.service.DesignationService;

@RestController
@RequestMapping("/api/designations")
public class DesignationController {

	private DesignationService designationService;

	@PostMapping
	public Designation createDesignation(@RequestBody Designation designation) {

		return designationService.createDesignation(designation);
	}

	@GetMapping
	public List<Designation> getAllDesignations() {
		return designationService.getAllDesignations();
	}

	@GetMapping("/{id}")
	public Designation getDesignationById(@PathVariable Long id) {

		return designationService.getDesignationById(id);
	}

	@PutMapping("/{id}")
	public Designation updateDesignation(@PathVariable Long id, @RequestBody Designation designation) {

		return designationService.updateDesignation(id, designation);
	}

	@DeleteMapping("/{id}")
	public void deleteDesignation(@PathVariable Long id) {

		designationService.deleteDesignation(id);
	}
}