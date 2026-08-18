package com.workforce.hrm.mapper;

import com.workforce.hrm.dto.response.DocumentResponseDTO;
import com.workforce.hrm.entity.Document;

public class DocumentMapper {

    private DocumentMapper() {
    }

    public static DocumentResponseDTO toResponseDTO(Document document) {

        if (document == null) {
            return null;
        }

        DocumentResponseDTO dto = new DocumentResponseDTO();

        dto.setDocumentId(document.getDocumentId());
        dto.setFileName(document.getFileName());
        dto.setOriginalFileName(document.getOriginalFileName());
        dto.setFileType(document.getFileType());
        dto.setFileSize(document.getFileSize());
        dto.setDocumentType(document.getDocumentType());
        dto.setUploadDate(document.getUploadDate());

        return dto;
    }
}