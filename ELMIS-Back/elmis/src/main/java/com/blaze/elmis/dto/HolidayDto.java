package com.blaze.elmis.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class HolidayDto {
    private Long id;
    private String name;
    private LocalDate date;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
