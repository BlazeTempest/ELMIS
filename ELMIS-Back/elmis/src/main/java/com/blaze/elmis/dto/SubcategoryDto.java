package com.blaze.elmis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubcategoryDto {
    private Long id;
    private String name;
    // We might not want to include the category in the subcategory DTO to avoid circular references,
    // or we can include just the category ID. For now, let's keep it simple.
    // private CategoryDto category;
    private Long categoryId;
}
