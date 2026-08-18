package com.workforce.hrm.mapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.workforce.hrm.dto.request.PayrollRequestDTO;
import com.workforce.hrm.dto.response.PayrollResponseDTO;
import com.workforce.hrm.entity.Employee;
import com.workforce.hrm.entity.Payroll;
import com.workforce.hrm.enums.PayrollStatus;

public class PayrollMapper {

    private PayrollMapper() {
        // Utility class
    }

    // =========================================================
    // REQUEST DTO -> ENTITY
    // =========================================================

    public static Payroll toEntity(
            PayrollRequestDTO dto,
            Employee employee) {

        if (dto == null) {
            return null;
        }

        Payroll payroll = new Payroll();

        payroll.setEmployee(employee);

        payroll.setMonth(dto.getMonth());
        payroll.setYear(dto.getYear());

        payroll.setBasicSalary(
                dto.getBasicSalary());

        payroll.setAllowances(
                dto.getAllowances());

        payroll.setDeductions(
                dto.getDeductions());

        // =====================================================
        // CALCULATE GROSS SALARY
        // Gross = Basic + Allowances
        // =====================================================

        BigDecimal grossSalary =
                dto.getBasicSalary()
                        .add(dto.getAllowances());

        payroll.setGrossSalary(
                grossSalary);

        // =====================================================
        // CALCULATE NET SALARY
        // Net = Gross - Deductions
        // =====================================================

        BigDecimal netSalary =
                grossSalary.subtract(
                        dto.getDeductions());

        payroll.setNetSalary(
                netSalary);

        payroll.setGeneratedDate(
                LocalDateTime.now());

        payroll.setPayrollStatus(
                PayrollStatus.GENERATED);

        return payroll;
    }


    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    public static PayrollResponseDTO toResponseDTO(
            Payroll payroll) {

        if (payroll == null) {
            return null;
        }

        PayrollResponseDTO dto =
                new PayrollResponseDTO();

        dto.setPayrollId(
                payroll.getPayrollId());

        // =====================================================
        // EMPLOYEE DETAILS
        // =====================================================

        if (payroll.getEmployee() != null) {

            Employee employee =
                    payroll.getEmployee();

            dto.setEmployeeId(
                    employee.getEmployeeId());

            dto.setEmployeeCode(
                    employee.getEmployeeCode());

            // -------------------------------------------------
            // Employee Full Name
            // -------------------------------------------------

            String firstName =
                    employee.getFirstName() != null
                            ? employee.getFirstName()
                            : "";

            String lastName =
                    employee.getLastName() != null
                            ? employee.getLastName()
                            : "";

            String fullName =
                    (firstName + " " + lastName)
                            .trim();

            dto.setEmployeeName(
                    fullName);

            // -------------------------------------------------
            // Department
            // -------------------------------------------------

            if (employee.getDepartment() != null) {

                dto.setDepartmentName(
                        employee.getDepartment()
                                .getDepartmentName());
            }
        }

        // =====================================================
        // PAYROLL DETAILS
        // =====================================================

        dto.setMonth(
                payroll.getMonth());

        dto.setYear(
                payroll.getYear());

        dto.setBasicSalary(
                payroll.getBasicSalary());

        dto.setAllowances(
                payroll.getAllowances());

        dto.setDeductions(
                payroll.getDeductions());

        dto.setGrossSalary(
                payroll.getGrossSalary());

        dto.setNetSalary(
                payroll.getNetSalary());

        dto.setGeneratedDate(
                payroll.getGeneratedDate());

        dto.setPayrollStatus(
                payroll.getPayrollStatus());

        return dto;
    }


    // =========================================================
    // UPDATE EXISTING PAYROLL
    // =========================================================

    public static void updateEntity(
            Payroll payroll,
            PayrollRequestDTO dto,
            Employee employee) {

        if (payroll == null || dto == null) {
            return;
        }

        payroll.setEmployee(employee);

        payroll.setMonth(
                dto.getMonth());

        payroll.setYear(
                dto.getYear());

        payroll.setBasicSalary(
                dto.getBasicSalary());

        payroll.setAllowances(
                dto.getAllowances());

        payroll.setDeductions(
                dto.getDeductions());

        // =====================================================
        // RECALCULATE GROSS SALARY
        // =====================================================

        BigDecimal grossSalary =
                dto.getBasicSalary()
                        .add(dto.getAllowances());

        payroll.setGrossSalary(
                grossSalary);

        // =====================================================
        // RECALCULATE NET SALARY
        // =====================================================

        BigDecimal netSalary =
                grossSalary.subtract(
                        dto.getDeductions());

        payroll.setNetSalary(
                netSalary);

        /*
         * Keep generatedDate updated when payroll
         * details are modified.
         */
        payroll.setGeneratedDate(
                LocalDateTime.now());

        /*
         * IMPORTANT:
         *
         * Do NOT automatically change payrollStatus here.
         *
         * Example:
         *
         * PAID payroll edited
         *      ↓
         * status should not silently become GENERATED.
         *
         * Status lifecycle can be handled separately.
         */
    }
}