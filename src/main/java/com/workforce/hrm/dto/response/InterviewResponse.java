package com.workforce.hrm.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.workforce.hrm.enums.InterviewStatus;
import com.workforce.hrm.enums.InterviewType;

public record InterviewResponse(
        Long interviewId,
        Long candidateId,
        String candidateName,
        Long interviewerId,
        String interviewerName,
        InterviewType interviewType,
        LocalDate interviewDate,
        LocalTime interviewTime,
        String meetingLink,
        String location,
        InterviewStatus status,
        String feedback,
        Integer rating) {
}
