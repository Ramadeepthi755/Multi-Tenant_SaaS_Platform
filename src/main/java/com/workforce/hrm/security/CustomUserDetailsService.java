package com.workforce.hrm.security;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.entity.User;
import com.workforce.hrm.repository.UserRepository;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(
            String email)
            throws UsernameNotFoundException {

        String normalizedEmail =
                email == null
                        ? ""
                        : email.trim().toLowerCase();

        Optional<User> optionalUser =
                userRepository.findByEmail(
                        normalizedEmail
                );

        if (optionalUser.isEmpty()) {

            throw new UsernameNotFoundException(
                    "User not found with email: "
                            + normalizedEmail
            );
        }

        User user = optionalUser.get();

        if (!Boolean.TRUE.equals(
                user.isActive())) {

            throw new UsernameNotFoundException(
                    "User account is inactive."
            );
        }

        if (Boolean.TRUE.equals(
                user.isAccountLocked())) {

            throw new UsernameNotFoundException(
                    "User account is locked."
            );
        }

        if (!Boolean.TRUE.equals(
                user.getEnabled())) {

            throw new UsernameNotFoundException(
                    "User account is disabled."
            );
        }

        return new CustomUserDetails(user);
    }

    /**
     * Get application User entity.
     *
     * Used by application services only.
     */
    @Transactional(readOnly = true)
    public User getUserByEmail(
            String email) {

        String normalizedEmail =
                email == null
                        ? ""
                        : email.trim().toLowerCase();

        return userRepository.findByEmail(
                        normalizedEmail
                )
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: "
                                        + normalizedEmail
                        )
                );
    }
}