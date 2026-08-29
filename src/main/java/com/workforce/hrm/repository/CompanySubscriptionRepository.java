package com.workforce.hrm.repository;

import com.workforce.hrm.entity.CompanySubscription;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanySubscriptionRepository extends JpaRepository<CompanySubscription, Long> {
    Optional<CompanySubscription> findByCompanyId(Long companyId);
}
