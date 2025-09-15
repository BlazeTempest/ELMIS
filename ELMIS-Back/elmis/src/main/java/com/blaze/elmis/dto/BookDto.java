package com.blaze.elmis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDto {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private Integer publicationYear;
    private Integer quantity;
    private Integer availableQuantity;
    private Double avgRating;
    private Integer totalReviews;
    private CategoryDto category;
    private SubcategoryDto subcategory;
}
