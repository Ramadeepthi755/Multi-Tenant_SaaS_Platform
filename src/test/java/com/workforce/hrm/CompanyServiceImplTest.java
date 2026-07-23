package com.workforce.hrm;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.workforce.hrm.dto.request.CompanyRequestDTO;
import com.workforce.hrm.dto.response.CompanyResponseDTO;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.exception.ResourceNotFoundException;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.service.impl.CompanyServiceImpl;

@ExtendWith(MockitoExtension.class)
class CompanyServiceImplTest {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyServiceImpl companyService;

    @Test
    void createCompanyTest() {

        CompanyRequestDTO request =
                new CompanyRequestDTO();

        request.setCompanyName("TCS");
        request.setCompanyCode("TCS001");
        request.setEmail("hr@tcs.com");
        request.setPhone("9999999999");

        Company company = new Company();

        company.setId(1L);
        company.setCompanyName("TCS");
        company.setCompanyCode("TCS001");
        company.setEmail("hr@tcs.com");
        company.setPhone("9999999999");

        when(companyRepository.existsByCompanyCode("TCS001"))
                .thenReturn(false);

        when(companyRepository.save(any(Company.class)))
                .thenReturn(company);

        CompanyResponseDTO response =
                companyService.createCompany(request);

        assertNotNull(response);

        assertEquals("TCS",
                response.getCompanyName());

        assertEquals("TCS001",
                response.getCompanyCode());
    }

    @Test
    void duplicateCompanyCodeTest() {

        CompanyRequestDTO request =
                new CompanyRequestDTO();

        request.setCompanyCode("TCS001");

        when(companyRepository.existsByCompanyCode("TCS001"))
                .thenReturn(true);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> companyService.createCompany(request));

        assertEquals(
                "Company Code Already Exists",
                exception.getMessage());
    }

    @Test
    void getCompanyByIdTest() {

        Company company = new Company();

        company.setId(1L);
        company.setCompanyName("Infosys");
        company.setCompanyCode("INF001");
        company.setEmail("hr@infosys.com");
        company.setPhone("9999999999");

        when(companyRepository.findById(1L))
                .thenReturn(Optional.of(company));

        CompanyResponseDTO response =
                companyService.getCompanyById(1L);

        assertNotNull(response);

        assertEquals(
                "Infosys",
                response.getCompanyName());
    }

    @Test
    void companyNotFoundTest() {

        when(companyRepository.findById(100L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> companyService.getCompanyById(100L));

        assertEquals(
                "Company Not Found",
                exception.getMessage());
    }

    @Test
    void updateCompanyTest() {

        Company existingCompany =
                new Company();

        existingCompany.setId(1L);
        existingCompany.setCompanyName("Old Company");

        CompanyRequestDTO request =
                new CompanyRequestDTO();

        request.setCompanyName("New Company");
        request.setCompanyCode("NEW001");
        request.setEmail("new@gmail.com");
        request.setPhone("9876543210");

        when(companyRepository.findById(1L))
                .thenReturn(Optional.of(existingCompany));

        when(companyRepository.save(any(Company.class)))
                .thenReturn(existingCompany);

        CompanyResponseDTO response =
                companyService.updateCompany(
                        1L,
                        request);

        assertEquals(
                "New Company",
                response.getCompanyName());
    }

    @Test
    void deleteCompanyTest() {

        Company company = new Company();

        company.setId(1L);

        when(companyRepository.findById(1L))
                .thenReturn(Optional.of(company));

        assertDoesNotThrow(() ->
                companyService.deleteCompany(1L));
    }
}