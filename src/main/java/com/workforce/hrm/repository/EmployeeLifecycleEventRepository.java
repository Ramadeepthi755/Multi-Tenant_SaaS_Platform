package com.workforce.hrm.repository;

import com.workforce.hrm.entity.EmployeeLifecycleEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeLifecycleEventRepository extends JpaRepository<EmployeeLifecycleEvent, Long> {
    List<EmployeeLifecycleEvent> findByEmployeeEmployeeIdOrderByTimestampDesc(Long employeeId);
    List<EmployeeLifecycleEvent> findByCompanyIdOrderByTimestampDesc(Long companyId);
}
