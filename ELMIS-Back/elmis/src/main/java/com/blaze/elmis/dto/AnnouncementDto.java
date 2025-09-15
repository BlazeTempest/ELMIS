package com.blaze.elmis.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AnnouncementDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
