package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.request.PayrollRequestDTO;
import com.workforce.hrm.dto.response.PayrollResponseDTO;
import com.workforce.hrm.service.PayrollService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payroll")
@Validated
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(
            PayrollService payrollService) {

        this.payrollService = payrollService;
    }

    // =========================================================
    // GENERATE PAYROLL
    // =========================================================

    @PostMapping("/generate")
    @PreAuthorize("hasAuthority('PAYROLL_CREATE')")
    public ResponseEntity<PayrollResponseDTO>
            generatePayroll(
                    @Valid @RequestBody
                    PayrollRequestDTO request) {

        PayrollResponseDTO response =
                payrollService.generatePayroll(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // GET ALL PAYROLLS
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<List<PayrollResponseDTO>>
            getAllPayrolls() {

        List<PayrollResponseDTO> payrolls =
                payrollService.getAllPayrolls();

        return ResponseEntity.ok(payrolls);
    }

    // =========================================================
    // GET PAYROLL BY ID
    // =========================================================

    @GetMapping("/{payrollId}")
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<PayrollResponseDTO>
            getPayrollById(
                    @PathVariable Long payrollId) {

        PayrollResponseDTO response =
                payrollService
                        .getPayrollById(payrollId);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET PAYROLL BY EMPLOYEE
    // =========================================================

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<List<PayrollResponseDTO>>
            getPayrollByEmployee(
                    @PathVariable Long employeeId) {

        List<PayrollResponseDTO> payrolls =
                payrollService
                        .getPayrollByEmployee(employeeId);

        return ResponseEntity.ok(payrolls);
    }

    // =========================================================
    // DELETE PAYROLL
    // =========================================================

    @DeleteMapping("/{payrollId}")
    @PreAuthorize("hasAuthority('PAYROLL_DELETE')")
    public ResponseEntity<Void>
            deletePayroll(
                    @PathVariable Long payrollId) {

        payrollService.deletePayroll(payrollId);

        return ResponseEntity
                .noContent()
                .build();
    }

    // =========================================================
    // DOWNLOAD SALARY SLIP
    // =========================================================

    @GetMapping("/slip/{payrollId}")
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<byte[]>
            downloadSalarySlip(
                    @PathVariable Long payrollId) {

        byte[] pdf =
                payrollService
                        .generateSalarySlip(payrollId);

        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"SalarySlip-"
                                + payrollId
                                + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}