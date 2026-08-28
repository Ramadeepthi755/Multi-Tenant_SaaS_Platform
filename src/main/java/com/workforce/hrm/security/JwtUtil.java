package com.workforce.hrm.security;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.workforce.hrm.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @PostConstruct
    void validateConfiguration() {
        getSigningKey();
        if (jwtExpiration <= 0) {
            throw new IllegalStateException("JWT expiration must be greater than zero.");
        }
    }

    public String generateToken(
            User user,
            UserDetails userDetails) {

        List<String> permissions =
                userDetails
                        .getAuthorities()
                        .stream()
                        .map(
                                GrantedAuthority::getAuthority
                        )
                        .distinct()
                        .collect(
                                Collectors.toList()
                        );

        String role = null;

        if (user.getRole() != null) {

            role =
                    user.getRole()
                            .getRoleName();
        }

        return Jwts.builder()

                .claim(
                        "userId",
                        user.getUserId()
                )

                .claim(
                        "fullName",
                        user.getFullName()
                )

                .claim(
                        "email",
                        user.getEmail()
                )

                .claim(
                        "role",
                        role
                )

                .claim(
                        "permissions",
                        permissions
                )

                .setSubject(
                        user.getEmail()
                )

                .setIssuedAt(
                        new Date()
                )

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpiration
                        )
                )

                .signWith(
                        getSigningKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();
    }

    public String extractUsername(
            String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    public Date extractExpiration(
            String token) {

        return extractAllClaims(token)
                .getExpiration();
    }

    public boolean isTokenExpired(
            String token) {

        return extractExpiration(token)
                .before(new Date());
    }

    public boolean validateToken(
            String token,
            UserDetails userDetails) {

        try {

            String username =
                    extractUsername(token);

            return username.equals(
                    userDetails.getUsername()
            )
                    && !isTokenExpired(token);

        } catch (Exception ex) {

            return false;
        }
    }

    public Claims extractAllClaims(
            String token) {

        return Jwts
                .parserBuilder()
                .setSigningKey(
                        getSigningKey()
                )
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {

        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException(
                    "JWT secret is missing. Set jwt.secret or JWT_SECRET to a Base64-encoded 32-byte secret for HS256."
            );
        }

        try {

            byte[] keyBytes = Decoders.BASE64.decode(secretKey.trim());

            if (keyBytes.length < 32) {
                throw new IllegalStateException(
                        "JWT secret is too short for HS256. Use a Base64-encoded secret at least 32 bytes long."
                );
            }

            return Keys.hmacShaKeyFor(keyBytes);

        } catch (IllegalArgumentException ex) {

            throw new IllegalStateException(
                    "JWT secret must be Base64-encoded and valid for HS256. Set jwt.secret or JWT_SECRET to a proper Base64 secret value.",
                    ex
            );
        }
    }
}
