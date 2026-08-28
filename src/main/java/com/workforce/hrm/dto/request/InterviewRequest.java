package com.workforce.hrm.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import com.workforce.hrm.enums.InterviewStatus;
import com.workforce.hrm.enums.InterviewType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record InterviewRequest(
        @NotNull(message = "Candidate is required") Long candidateId,
        @NotNull(message = "Interviewer is required") Long interviewerId,
        @NotNull(message = "Interview type is required") InterviewType interviewType,
        @NotNull(message = "Interview date is required") LocalDate interviewDate,
        @NotNull(message = "Interview time is required") LocalTime interviewTime,
        String meetingLink,
        String location,
        InterviewStatus status,
        String feedback,
        @Min(value = 1, message = "Rating must be between 1 and 10")
        @Max(value = 10, message = "Rating must be between 1 and 10") Integer rating) {
}
