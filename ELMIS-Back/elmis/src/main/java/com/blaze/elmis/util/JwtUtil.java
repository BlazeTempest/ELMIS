package com.blaze.elmis.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // Access token expiration time (10 hours)
    @Value("${jwt.expiration.access}")
    private Long accessTokenExpiration;

    // Refresh token expiration time (7 days)
    @Value("${jwt.expiration.refresh}")
    private Long refreshTokenExpiration;

    @Value("${jwt.secret}")
    private String secret;

    // --- Access Token Methods ---

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Generate Access Token
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Add role claim
        if (!userDetails.getAuthorities().isEmpty()) {
            claims.put("role", userDetails.getAuthorities().iterator().next().getAuthority());
        }
        return createToken(claims, userDetails.getUsername(), accessTokenExpiration);
    }

    // Method to extract role from Access Token
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // Validate Access Token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // --- Refresh Token Methods ---

    // Generate Refresh Token
    public String generateRefreshToken(UserDetails userDetails) {
        return createToken(new HashMap<>(), userDetails.getUsername(), refreshTokenExpiration);
    }

    // Validate Refresh Token
    public Boolean validateRefreshToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        // Refresh tokens might not have roles or other specific claims, so we focus on username and expiry
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // --- Common Token Creation ---

    private String createToken(Map<String, Object> claims, String subject, Long expirationTime) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}
