package com.example.registroautos.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms:0}")      // opcional - solo si lo usas para validar
    private long expirationMs;

    private Key signingKey;

    /* ---------- init ---------- */
    @PostConstruct
    void initKey() {
        signingKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String getTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer "))
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Token ausente o mal formado");
        return header.substring(7);
    }

    public String getUsernameFromToken(String token) {
        return getAllClaims(token).getSubject();
    }
    public String getUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public Long getUserIdFromToken(String token) {
        Object uid = getAllClaims(token).get("uid");        // claim “uid”
        if (uid == null)
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Token sin claim uid");
        if (uid instanceof Integer) return ((Integer) uid).longValue();
        if (uid instanceof Long)    return (Long) uid;
        return Long.valueOf(uid.toString());
    }

    /* ---------- validación ---------- */
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = getUsernameFromToken(token);
            boolean sameUser = username.equals(userDetails.getUsername());
            boolean notExpired = !isExpired(token);
            return sameUser && notExpired;
        } catch (JwtException | IllegalArgumentException ex) {
            log.warn("JWT inválido: {}", ex.getMessage());
            return false;
        }
    }

    public boolean isExpired(String token) {
        Date exp = getAllClaims(token).getExpiration();
        return exp.before(new Date());
    }

    /* ---------- internals ---------- */
    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
