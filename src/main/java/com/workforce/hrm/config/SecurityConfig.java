package com.workforce.hrm.config;

import com.workforce.hrm.security.CustomUserDetailsService;

import com.workforce.hrm.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtFilter jwtFilter;
	private final CustomUserDetailsService userDetailsService;

	public SecurityConfig(JwtFilter jwtFilter, CustomUserDetailsService userDetailsService) {
		this.jwtFilter = jwtFilter;
		this.userDetailsService = userDetailsService;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth

						.requestMatchers("/api/auth/**", "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**")
						.permitAll()

						.requestMatchers("/api/companies/**").hasRole("SUPER_ADMIN")

						.requestMatchers("/api/departments/**").hasAnyRole("SUPER_ADMIN", "COMPANY_ADMIN")

						.requestMatchers("/api/employees/**")
						.hasAnyRole("SUPER_ADMIN", "HR", "COMPANY_ADMIN")
						
						.requestMatchers("/api/team/**").hasRole("MANAGER")

						.requestMatchers("/api/profile/**").hasRole("EMPLOYEE")

						.requestMatchers("/api/users/*/lock").hasRole("SUPER_ADMIN")

						.requestMatchers("/api/users/*/unlock").hasRole("SUPER_ADMIN")

						.requestMatchers("/api/users/change-password").authenticated()

						.requestMatchers("/api/notifications/**")
						.hasAnyRole("SUPER_ADMIN", "COMPANY_ADMIN", "HR", "MANAGER", "EMPLOYEE")
						.requestMatchers("/api/payroll/**").hasAnyRole("SUPER_ADMIN", "COMPANY_ADMIN", "HR")
						.requestMatchers(HttpMethod.GET, "/api/payroll/slip/**")
						.hasAnyRole("SUPER_ADMIN", "COMPANY_ADMIN", "HR", "EMPLOYEE")
						.requestMatchers("/api/documents/**").hasAnyRole("HR", "EMPLOYEE", "COMPANY_ADMIN").anyRequest()
						.authenticated()

				)

				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {

		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);

		provider.setPasswordEncoder(passwordEncoder());

		return provider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

		return configuration.getAuthenticationManager();
	}

}