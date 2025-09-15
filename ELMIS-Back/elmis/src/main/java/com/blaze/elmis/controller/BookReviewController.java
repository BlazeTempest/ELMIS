package com.blaze.elmis.controller;

import com.blaze.elmis.dto.BookReviewDto;
import com.blaze.elmis.service.BookReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class BookReviewController {

    private final BookReviewService bookReviewService;

    @GetMapping
    public Page<BookReviewDto> getAllBookReviews(Pageable pageable) {
        return bookReviewService.getAllBookReviews(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookReviewDto> getBookReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(bookReviewService.getBookReviewById(id));
    }

    @PostMapping
    public ResponseEntity<BookReviewDto> createBookReview(@RequestBody BookReviewDto bookReviewDto) {
        return ResponseEntity.ok(bookReviewService.createBookReview(bookReviewDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookReviewDto> updateBookReview(@PathVariable Long id, @RequestBody BookReviewDto bookReviewDto) {
        return ResponseEntity.ok(bookReviewService.updateBookReview(id, bookReviewDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookReview(@PathVariable Long id) {
        bookReviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
