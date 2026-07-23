package com.workforce.hrm.service;

import java.util.List;
import com.workforce.hrm.entity.Leave;

public interface LeaveService {

    Leave createLeave(Leave leave);

    List<Leave> getAllLeaves();

    Leave getLeaveById(Long id);

    Leave updateLeave(Long id, Leave leave);

    void deleteLeave(Long id);

    void approveLeave(Long leaveId);

    void rejectLeave(Long leaveId);

    List<Leave> getEmployeeLeaves(Long employeeId);

}