package com.blaze.elmis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenRequest {
    private String refreshToken;

    // Assuming a username is needed to generate a new token,
    // although typically refresh tokens are validated independently.
    // If the username is not directly available, this might need a different approach.
    private String username;
}
