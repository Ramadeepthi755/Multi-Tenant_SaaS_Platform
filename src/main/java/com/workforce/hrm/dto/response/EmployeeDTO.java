package com.workforce.hrm.dto.response;

import java.time.LocalDate;

import com.workforce.hrm.enums.EmployeeStatus;
import com.workforce.hrm.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {

    private Long employeeId;

    private String employeeCode;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private Gender gender;

    private EmployeeStatus status;

    private LocalDate dateOfJoining;

}