package com.workforce.hrm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.workforce.hrm.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // =========================================================
    // FIND USER BY EMAIL
    // =========================================================

    Optional<User> findByEmail(String email);


    // =========================================================
    // CHECK EMAIL EXISTS
    // =========================================================

    boolean existsByEmail(String email);


    // =========================================================
    // FIND ALL USERS OF A COMPANY
    // =========================================================
    //
    // Explicit JPQL is intentionally used instead of relying
    // on Spring Data nested-property parsing.
    //
    // User -> company -> id
    //

    @Query("""
            SELECT u
            FROM User u
            WHERE u.company.id = :companyId
            """)
    List<User> findByCompanyId(
            @Param("companyId") Long companyId
    );


    // =========================================================
    // FIND USER BY USER ID + COMPANY ID
    // =========================================================
    //
    // This provides tenant isolation.
    //
    // Company A cannot access Company B user.
    //

    @Query("""
            SELECT u
            FROM User u
            WHERE u.userId = :userId
              AND u.company.id = :companyId
            """)
    Optional<User> findByUserIdAndCompanyId(
            @Param("userId") Long userId,
            @Param("companyId") Long companyId
    );
}