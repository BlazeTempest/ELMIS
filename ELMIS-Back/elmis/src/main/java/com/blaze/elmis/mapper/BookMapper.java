package com.blaze.elmis.mapper;

import com.blaze.elmis.dto.BookDto;
import com.blaze.elmis.dto.CategoryDto;
import com.blaze.elmis.dto.SubcategoryDto;
import com.blaze.elmis.model.Book;
import com.blaze.elmis.model.Category;
import com.blaze.elmis.model.Subcategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookMapper {

    // Single mappings
    CategoryDto categoryToCategoryDto(Category category);
    Category categoryDtoToCategory(CategoryDto categoryDto);

    SubcategoryDto subcategoryToSubcategoryDto(Subcategory subcategory);
    Subcategory subcategoryDtoToSubcategory(SubcategoryDto subcategoryDto);

    // List mappings
    List<CategoryDto> categoriesToCategoryDtos(List<Category> categories);
    List<Category> categoryDtosToCategories(List<CategoryDto> categoryDtos);

    List<SubcategoryDto> subcategoriesToSubcategoryDtos(List<Subcategory> subcategories);
    List<Subcategory> subcategoryDtosToSubcategories(List<SubcategoryDto> subcategoryDtos);

    // Book mappings
    @Mapping(source = "category", target = "category")
    @Mapping(source = "subcategory", target = "subcategory")
    BookDto bookToBookDto(Book book);

    @Mapping(source = "category.id", target = "category.id")
    @Mapping(source = "subcategory.id", target = "subcategory.id")
    Book bookDtoToBook(BookDto bookDto);

    // List mapping for Books
    List<BookDto> booksToBookDtos(List<Book> books);
    List<Book> bookDtosToBooks(List<BookDto> bookDtos);
}
