package com.workforce.hrm.repository;

import com.workforce.hrm.entity.User;
import com.workforce.hrm.enums.Role;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);

	List<User> findByRole(Role role);

	List<User> findByActiveTrue();
}