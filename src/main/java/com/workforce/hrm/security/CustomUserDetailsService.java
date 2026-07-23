package com.workforce.hrm.security;

import com.workforce.hrm.entity.User;
import com.workforce.hrm.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;
	private static final Logger log =
	        LoggerFactory.getLogger(CustomUserDetailsService.class);

	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

		

		log.info("Loading user {}", email);
		return org.springframework.security.core.userdetails.User
		        .withUsername(user.getEmail())
		        .password(user.getPassword())
		        .authorities("ROLE_" + user.getRole())
		        .build();
	}
}