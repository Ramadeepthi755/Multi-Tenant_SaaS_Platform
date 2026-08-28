package com.workforce.hrm.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.workforce.hrm.dto.request.PayrollRequestDTO;
import com.workforce.hrm.dto.response.PayrollResponseDTO;
import com.workforce.hrm.enums.PayrollStatus;

public interface PayrollService {

	PayrollResponseDTO generatePayroll(PayrollRequestDTO request);

	PayrollResponseDTO getPayrollById(Long payrollId);

	List<PayrollResponseDTO> getAllPayrolls();

	Page<PayrollResponseDTO> getPayrollsForReport(Long employeeId, Long departmentId,
			PayrollStatus status, String month, Integer year, Pageable pageable);

	List<PayrollResponseDTO> getPayrollByEmployee(Long employeeId);

	void deletePayroll(Long payrollId);

	byte[] generateSalarySlip(Long payrollId);
	void generatePayrollForAllEmployees();

}
