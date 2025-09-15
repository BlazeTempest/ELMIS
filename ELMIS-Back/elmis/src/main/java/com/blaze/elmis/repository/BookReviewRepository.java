package com.blaze.elmis.repository;

import com.blaze.elmis.model.BookReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookReviewRepository extends JpaRepository<BookReview, Long>, JpaSpecificationExecutor<BookReview> {
    List<BookReview> findByBookId(Long bookId);
    Optional<BookReview> findByBookIdAndUserId(Long bookId, Long userId);
}
