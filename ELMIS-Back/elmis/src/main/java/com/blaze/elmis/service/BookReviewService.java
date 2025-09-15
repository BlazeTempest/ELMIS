package com.blaze.elmis.service;

import com.blaze.elmis.dto.BookReviewDto;
import com.blaze.elmis.mapper.BookReviewMapper;
import com.blaze.elmis.model.Book;
import com.blaze.elmis.model.BookReview;
import com.blaze.elmis.model.User;
import com.blaze.elmis.repository.BookRepository;
import com.blaze.elmis.repository.BookReviewRepository;
import com.blaze.elmis.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookReviewService {

    private final BookReviewRepository bookReviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookReviewMapper bookReviewMapper;

    public List<BookReviewDto> getReviewsByBookId(Long bookId) {
        return bookReviewRepository.findByBookId(bookId).stream()
                .map(bookReviewMapper::bookReviewToBookReviewDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookReviewDto addReview(Long bookId, BookReviewDto reviewDto) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        User user = userRepository.findById(reviewDto.getUserId()) // Assuming reviewDto contains userId
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user already reviewed this book
        Optional<BookReview> existingReview = bookReviewRepository.findByBookIdAndUserId(bookId, reviewDto.getUserId());
        if (existingReview.isPresent()) {
            throw new RuntimeException("User has already reviewed this book.");
        }

        BookReview review = bookReviewMapper.bookReviewDtoToBookReview(reviewDto);
        review.setBook(book);
        review.setUser(user);

        BookReview savedReview = bookReviewRepository.save(review);
        updateBookRating(book); // Update book's average rating and review count
        return bookReviewMapper.bookReviewToBookReviewDto(savedReview);
    }

    @Transactional
    public BookReviewDto updateBookReview(Long id, BookReviewDto bookReviewDto) {
        BookReview existingReview = bookReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Optional: Add authorization check here to ensure only the user who wrote the review can update it.

        Book book = existingReview.getBook(); // Get the book associated with the review

        existingReview.setRating(bookReviewDto.getRating());
        existingReview.setComment(bookReviewDto.getComment());

        BookReview updatedReview = bookReviewRepository.save(existingReview);
        updateBookRating(book); // Re-calculate rating as it might have changed
        return bookReviewMapper.bookReviewToBookReviewDto(updatedReview);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        BookReview review = bookReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        Book book = review.getBook();
        bookReviewRepository.deleteById(reviewId);
        updateBookRating(book); // Re-calculate rating after deletion
    }

    private void updateBookRating(Book book) {
        List<BookReview> reviews = bookReviewRepository.findByBookId(book.getId());
        int totalReviews = reviews.size();
        double avgRating = reviews.stream()
                .mapToInt(BookReview::getRating)
                .average()
                .orElse(0.0);

        book.setTotalReviews(totalReviews);
        book.setAvgRating(avgRating);
        bookRepository.save(book);
    }

    @Transactional(readOnly = true)
    public BookReviewDto getBookReviewById(Long id) {
        BookReview bookReview = bookReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book review not found"));
        return bookReviewMapper.bookReviewToBookReviewDto(bookReview);
    }

    @Transactional(readOnly = true)
    public Page<BookReviewDto> getAllBookReviews(Pageable pageable) {
        return bookReviewRepository.findAll(pageable).map(bookReviewMapper::bookReviewToBookReviewDto);
    }

    // Removed placeholder method as findByBookId is now in the repository.
    
    @Transactional
    public BookReviewDto createBookReview(BookReviewDto bookReviewDto) {
        // Assuming BookReviewDto contains bookId. If not, this needs adjustment.
        Long bookId = bookReviewDto.getBookId(); 
        if (bookId == null) {
            throw new RuntimeException("Book ID is required to create a review.");
        }
        return addReview(bookId, bookReviewDto);
    }
}
