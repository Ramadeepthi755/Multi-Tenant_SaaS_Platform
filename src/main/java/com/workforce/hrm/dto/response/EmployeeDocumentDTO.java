package com.workforce.hrm.dto.response;

import java.time.LocalDateTime;

import com.workforce.hrm.enums.DocumentType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDocumentDTO {

    private Long documentId;

    private DocumentType documentType;

    private String originalFileName;

    private String fileType;

    private Long fileSize;

    private LocalDateTime uploadDate;

}