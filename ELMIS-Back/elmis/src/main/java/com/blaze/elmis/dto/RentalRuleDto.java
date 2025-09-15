package com.blaze.elmis.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RentalRuleDto {
    private Long id;
    private String ruleName;
    private String ruleValue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
