package com.blaze.elmis.service;

import com.blaze.elmis.dto.AuthRequest;
import com.blaze.elmis.dto.AuthResponse;
import com.blaze.elmis.dto.RefreshTokenRequest;
import com.blaze.elmis.dto.RegisterRequest;
import com.blaze.elmis.model.User;
import com.blaze.elmis.repository.UserRepository;
import com.blaze.elmis.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole())
                .build();
        userRepository.save(user);
        String jwtToken = jwtUtil.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String jwtToken = jwtUtil.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        // In a real application, you would validate the refresh token,
        // find the associated user, and generate a new access token.
        // For this example, we'll just generate a new token based on the username
        // from the request, assuming it's valid.
        String username = request.getUsername(); // Assuming RefreshTokenRequest has a getUsername() method
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found for refresh token"));
        String newToken = jwtUtil.generateToken(user);
        return AuthResponse.builder().token(newToken).build();
    }
}
