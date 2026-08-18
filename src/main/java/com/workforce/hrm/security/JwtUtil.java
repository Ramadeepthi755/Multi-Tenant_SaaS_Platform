package com.workforce.hrm.security;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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

        byte[] keyBytes =
                Decoders.BASE64.decode(
                        secretKey
                );

        return Keys.hmacShaKeyFor(
                keyBytes
        );
    }
}