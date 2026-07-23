package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.dto.request.PayrollRequestDTO;
import com.workforce.hrm.dto.response.PayrollResponseDTO;
import com.workforce.hrm.service.PayrollService;

import jakarta.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/payroll")
@Validated
public class PayrollController {

	private final PayrollService payrollService;

	public PayrollController(PayrollService payrollService) {
		this.payrollService = payrollService;
	}

	@PostMapping("/generate")
	public ResponseEntity<PayrollResponseDTO> generatePayroll(@Valid @RequestBody PayrollRequestDTO request) {

		PayrollResponseDTO response = payrollService.generatePayroll(request);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@GetMapping("/{payrollId}")
	public ResponseEntity<PayrollResponseDTO> getPayrollById(@PathVariable Long payrollId) {

		return ResponseEntity.ok(payrollService.getPayrollById(payrollId));
	}

	@GetMapping
	public ResponseEntity<List<PayrollResponseDTO>> getAllPayrolls() {

		return ResponseEntity.ok(payrollService.getAllPayrolls());
	}

	@GetMapping("/employee/{employeeId}")
	public ResponseEntity<List<PayrollResponseDTO>> getPayrollByEmployee(@PathVariable Long employeeId) {

		return ResponseEntity.ok(payrollService.getPayrollByEmployee(employeeId));
	}

	@DeleteMapping("/{payrollId}")
	public ResponseEntity<String> deletePayroll(@PathVariable Long payrollId) {

		payrollService.deletePayroll(payrollId);

		return ResponseEntity.ok("Payroll deleted successfully.");
	}

	@GetMapping("/slip/{payrollId}")
	public ResponseEntity<byte[]> downloadSalarySlip(@PathVariable Long payrollId) {

		byte[] pdf = payrollService.generateSalarySlip(payrollId);

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=SalarySlip.pdf")
				.contentType(MediaType.APPLICATION_PDF).body(pdf);
	}

}