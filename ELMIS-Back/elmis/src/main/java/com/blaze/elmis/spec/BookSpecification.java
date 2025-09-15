package com.blaze.elmis.spec;

import com.blaze.elmis.model.Book;
import com.blaze.elmis.model.Category;
import com.blaze.elmis.model.Subcategory;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class BookSpecification {

    public static Specification<Book> searchBooks(String title, String author, String isbn, Long categoryId, Long subcategoryId) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure distinct results

            Predicate predicate = criteriaBuilder.conjunction(); // Start with a conjunction (AND)

            if (title != null && !title.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }
            if (author != null && !author.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.like(criteriaBuilder.lower(root.get("author")), "%" + author.toLowerCase() + "%"));
            }
            if (isbn != null && !isbn.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("isbn"), isbn));
            }
            if (categoryId != null) {
                Join<Book, Category> categoryJoin = root.join("category");
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(categoryJoin.get("id"), categoryId));
            }
            if (subcategoryId != null) {
                Join<Book, Subcategory> subcategoryJoin = root.join("subcategory");
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(subcategoryJoin.get("id"), subcategoryId));
            }

            return predicate;
        };
    }
}
