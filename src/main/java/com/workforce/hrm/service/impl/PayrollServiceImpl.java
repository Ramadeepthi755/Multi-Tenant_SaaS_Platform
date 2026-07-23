package com.workforce.hrm.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.PayrollRequestDTO;
import com.workforce.hrm.dto.response.PayrollResponseDTO;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Payroll;
import com.workforce.hrm.enums.PayrollStatus;
import com.workforce.hrm.exception.ResourceNotFoundException;
import com.workforce.hrm.repository.EmployeeRepository;
import com.workforce.hrm.repository.PayrollRepository;
import com.workforce.hrm.service.PayrollService;
import com.workforce.hrm.util.PdfGenerator;

@Service
public class PayrollServiceImpl implements PayrollService {

	private final PayrollRepository payrollRepository;
	private final EmployeeRepository employeeRepository;

	public PayrollServiceImpl(PayrollRepository payrollRepository, EmployeeRepository employeeRepository) {
		this.payrollRepository = payrollRepository;
		this.employeeRepository = employeeRepository;
	}

	@Override
	public PayrollResponseDTO generatePayroll(PayrollRequestDTO request) {

		Employee employee = employeeRepository.findById(request.getEmployeeId())
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

		payrollRepository
				.findByEmployeeEmployeeIdAndMonthAndYear(request.getEmployeeId(), request.getMonth(), request.getYear())
				.ifPresent(payroll -> {
					throw new RuntimeException("Payroll already generated for this employee.");
				});

		Payroll payroll = new Payroll();

		payroll.setEmployee(employee);
		payroll.setMonth(request.getMonth());
		payroll.setYear(request.getYear());
		payroll.setBasicSalary(request.getBasicSalary());
		payroll.setAllowances(request.getAllowances());
		payroll.setDeductions(request.getDeductions());

		BigDecimal grossSalary = request.getBasicSalary().add(request.getAllowances());

		BigDecimal netSalary = grossSalary.subtract(request.getDeductions());

		payroll.setGrossSalary(grossSalary);
		payroll.setNetSalary(netSalary);
		payroll.setGeneratedDate(LocalDateTime.now());
		payroll.setPayrollStatus(PayrollStatus.GENERATED);

		Payroll savedPayroll = payrollRepository.save(payroll);

		return mapToDTO(savedPayroll);
	}

	@Override
	public PayrollResponseDTO getPayrollById(Long payrollId) {

		Payroll payroll = payrollRepository.findById(payrollId)
				.orElseThrow(() -> new ResourceNotFoundException("Payroll not found"));

		return mapToDTO(payroll);
	}

	@Override
	public List<PayrollResponseDTO> getAllPayrolls() {

		return payrollRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	@Override
	public List<PayrollResponseDTO> getPayrollByEmployee(Long employeeId) {

		return payrollRepository.findByEmployeeEmployeeId(employeeId).stream().map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	@Override
	public void deletePayroll(Long payrollId) {

		Payroll payroll = payrollRepository.findById(payrollId)
				.orElseThrow(() -> new ResourceNotFoundException("Payroll not found"));

		payrollRepository.delete(payroll);
	}

	private PayrollResponseDTO mapToDTO(Payroll payroll) {

		PayrollResponseDTO dto = new PayrollResponseDTO();

		dto.setPayrollId(payroll.getPayrollId());

		dto.setEmployeeId(payroll.getEmployee().getEmployeeId());

		dto.setEmployeeName(payroll.getEmployee().getFirstName() + " " + payroll.getEmployee().getLastName());

		dto.setMonth(payroll.getMonth());
		dto.setYear(payroll.getYear());
		dto.setBasicSalary(payroll.getBasicSalary());
		dto.setAllowances(payroll.getAllowances());
		dto.setDeductions(payroll.getDeductions());
		dto.setGrossSalary(payroll.getGrossSalary());
		dto.setNetSalary(payroll.getNetSalary());
		dto.setGeneratedDate(payroll.getGeneratedDate());
		dto.setPayrollStatus(payroll.getPayrollStatus());

		return dto;
	}

	@Override
	@Transactional(readOnly = true)
	public byte[] generateSalarySlip(Long payrollId) {

		Payroll payroll = payrollRepository.findById(payrollId)
				.orElseThrow(() -> new RuntimeException("Payroll not found"));

		return PdfGenerator.generateSalarySlip(payroll);
	}
	@Override
	public void generatePayrollForAllEmployees() {
	    throw new UnsupportedOperationException("Not implemented yet");
	}
}