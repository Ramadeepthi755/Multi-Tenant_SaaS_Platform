package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.entity.Leave;
import com.workforce.hrm.service.LeaveService;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

	private LeaveService leaveService;

	@PostMapping
	public Leave createLeave(@RequestBody Leave leave) {
		return leaveService.createLeave(leave);
	}

	@GetMapping
	public List<Leave> getAllLeaves() {
		return leaveService.getAllLeaves();
	}

	@GetMapping("/{id}")
	public Leave getLeaveById(@PathVariable Long id) {
		return leaveService.getLeaveById(id);
	}

	@PutMapping("/{id}")
	public Leave updateLeave(@PathVariable Long id, @RequestBody Leave leave) {

		return leaveService.updateLeave(id, leave);
	}

	@DeleteMapping("/{id}")
	public void deleteLeave(@PathVariable Long id) {
		leaveService.deleteLeave(id);
	}
}