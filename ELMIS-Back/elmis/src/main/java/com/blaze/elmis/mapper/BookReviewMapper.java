package com.blaze.elmis.mapper;

import com.blaze.elmis.dto.BookReviewDto;
import com.blaze.elmis.model.BookReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface BookReviewMapper {

    @Mapping(source = "book.id", target = "bookId")
    @Mapping(source = "user.id", target = "userId")
    BookReviewDto bookReviewToBookReviewDto(BookReview bookReview);

    @Mapping(target = "book", ignore = true) // Ignore book entity for DTO to entity mapping
    @Mapping(target = "user", ignore = true) // Ignore user entity for DTO to entity mapping
    @Mapping(target = "createdAt", ignore = true) // Ignore audit fields
    @Mapping(target = "updatedAt", ignore = true) // Ignore audit fields
    BookReview bookReviewDtoToBookReview(BookReviewDto bookReviewDto);
}
