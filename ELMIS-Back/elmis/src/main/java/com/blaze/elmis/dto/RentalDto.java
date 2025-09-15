package com.blaze.elmis.dto;

import com.blaze.elmis.model.RentalStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RentalDto {
    private Long id;
    private Long bookId;
    private Long userId;
    private LocalDateTime rentalDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private RentalStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
