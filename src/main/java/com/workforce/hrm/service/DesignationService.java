package com.workforce.hrm.service;

import java.util.List;

import com.workforce.hrm.dto.request.DesignationRequestDTO;
import com.workforce.hrm.dto.response.DesignationResponseDTO;

public interface DesignationService {

    DesignationResponseDTO createDesignation(DesignationRequestDTO request);

    List<DesignationResponseDTO> getAllDesignations();

    DesignationResponseDTO getDesignationById(Long id);

    DesignationResponseDTO updateDesignation(Long id, DesignationRequestDTO request);

    void deleteDesignation(Long id);

    List<DesignationResponseDTO> getByDepartment(Long departmentId);
}