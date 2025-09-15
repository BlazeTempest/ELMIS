package com.blaze.elmis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;

    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // For created_by, we might want to store the user's ID or a simplified representation
    private Long createdByUserId;
    // Or if we want to include more user details, we could have a UserDto here
    // private UserDto createdByUser;
}
