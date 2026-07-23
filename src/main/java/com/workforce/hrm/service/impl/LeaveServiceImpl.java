package com.workforce.hrm.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workforce.hrm.entity.Leave;
import com.workforce.hrm.repository.LeaveRepository;
import com.workforce.hrm.service.LeaveService;

@Service
public class LeaveServiceImpl implements LeaveService {

	@Autowired
	private LeaveRepository leaveRepository;

	@Override
	public Leave createLeave(Leave leave) {
		return leaveRepository.save(leave);
	}

	@Override
	public List<Leave> getAllLeaves() {
		return leaveRepository.findAll();
	}

	@Override
	public Leave getLeaveById(Long id) {
		return leaveRepository.findById(id).orElseThrow(() -> new RuntimeException("Leave Not Found"));
	}

	@Override
	public Leave updateLeave(Long id, Leave leave) {

		Leave existingLeave = leaveRepository.findById(id).orElseThrow(() -> new RuntimeException("Leave Not Found"));

		existingLeave.setLeaveType(leave.getLeaveType());
		existingLeave.setStartDate(leave.getStartDate());
		existingLeave.setEndDate(leave.getEndDate());
		existingLeave.setReason(leave.getReason());
		existingLeave.setStatus(leave.getStatus());

		return leaveRepository.save(existingLeave);
	}

	@Override
	public void deleteLeave(Long id) {

		Leave leave = leaveRepository.findById(id).orElseThrow(() -> new RuntimeException("Leave Not Found"));

		leaveRepository.delete(leave);
	}
	@Override
	public void approveLeave(Long leaveId) {
	    throw new UnsupportedOperationException("Not implemented yet");
	}

	@Override
	public void rejectLeave(Long leaveId) {
	    throw new UnsupportedOperationException("Not implemented yet");
	}

	@Override
	public List<Leave> getEmployeeLeaves(Long employeeId) {
	    return leaveRepository.findByEmployeeEmployeeId(employeeId);
	}
}