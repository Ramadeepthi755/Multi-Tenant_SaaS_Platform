package com.workforce.hrm.security;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtFilter jwtFilter;
    private final List<String> allowedOrigins;

    public SecurityConfig(
            CustomUserDetailsService userDetailsService,
            JwtFilter jwtFilter,
            @org.springframework.beans.factory.annotation.Value(
                    "${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
            String corsAllowedOrigins) {

        this.userDetailsService = userDetailsService;
        this.jwtFilter = jwtFilter;
        this.allowedOrigins = Arrays.stream(
                        corsAllowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();
    }

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                // =================================================
                // CSRF
                // =================================================

                .csrf(csrf -> csrf.disable())

                // =================================================
                // CORS
                // =================================================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // =================================================
                // SESSION
                // =================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .exceptionHandling(exception -> exception

                        // =====================================================
                        // 401 - UNAUTHENTICATED
                        // =====================================================

                        .authenticationEntryPoint(
                                (request, response, authException) -> {

                                    response.setStatus(
                                            HttpServletResponse.SC_UNAUTHORIZED
                                    );

                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.getWriter().write(
                                            """
                                            {
                                              "status": 401,
                                              "message": "Authentication required",
                                              "errors": null
                                            }
                                            """
                                    );
                                }
                        )

                        // =====================================================
                        // 403 - FORBIDDEN
                        // =====================================================

                        .accessDeniedHandler(
                                (request, response, accessDeniedException) -> {

                                    response.setStatus(
                                            HttpServletResponse.SC_FORBIDDEN
                                    );

                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.getWriter().write(
                                            """
                                            {
                                              "status": 403,
                                              "message": "Access Denied",
                                              "errors": null
                                            }
                                            """
                                    );
                                }
                        )
                )
                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth

                        // -------------------------------------------------
                        // PUBLIC AUTHENTICATION APIs
                        // -------------------------------------------------

                        .requestMatchers(
                                "/auth/**",
                                "/api/auth/**"
                        ).permitAll()

                        // -------------------------------------------------
                        // SWAGGER
                        // -------------------------------------------------

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/api/swagger-ui/**",
                                "/api/v3/api-docs/**"
                        ).permitAll()

                        // -------------------------------------------------
                        // CORS PREFLIGHT
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // -------------------------------------------------
                        // ALL OTHER APIs
                        // -------------------------------------------------

                        .anyRequest()
                        .authenticated()
                )

                // =================================================
                // AUTHENTICATION PROVIDER
                // =================================================

                .authenticationProvider(
                        authenticationProvider()
                )

                // =================================================
                // JWT FILTER
                // =================================================

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // =========================================================
    // AUTHENTICATION PROVIDER
    // =========================================================

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(
                userDetailsService
        );

        provider.setPasswordEncoder(
                passwordEncoder()
        );

        return provider;
    }

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    // =========================================================
    // CORS
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(allowedOrigins);

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "Origin",
                        "X-Requested-With"
                )
        );

        configuration.setExposedHeaders(
                List.of("Authorization")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}
