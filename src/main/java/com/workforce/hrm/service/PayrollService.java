package com.workforce.hrm.service;

import java.util.List;

import com.workforce.hrm.dto.request.PayrollRequestDTO;
import com.workforce.hrm.dto.response.PayrollResponseDTO;

public interface PayrollService {

	PayrollResponseDTO generatePayroll(PayrollRequestDTO request);

	PayrollResponseDTO getPayrollById(Long payrollId);

	List<PayrollResponseDTO> getAllPayrolls();

	List<PayrollResponseDTO> getPayrollByEmployee(Long employeeId);

	void deletePayroll(Long payrollId);

	byte[] generateSalarySlip(Long payrollId);
	void generatePayrollForAllEmployees();

}