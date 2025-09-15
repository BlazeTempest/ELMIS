package com.blaze.elmis.service;

import com.blaze.elmis.dto.BookDto;
import com.blaze.elmis.dto.BookReviewDto;
import com.blaze.elmis.mapper.BookMapper;
import com.blaze.elmis.mapper.BookReviewMapper;
import com.blaze.elmis.model.Book;
import com.blaze.elmis.model.BookReview;
import com.blaze.elmis.model.Category;
import com.blaze.elmis.model.Subcategory;
import com.blaze.elmis.model.User;
import com.blaze.elmis.repository.BookRepository;
import com.blaze.elmis.repository.BookReviewRepository;
import com.blaze.elmis.repository.CategoryRepository;
import com.blaze.elmis.repository.SubcategoryRepository;
import com.blaze.elmis.repository.UserRepository;
import com.blaze.elmis.spec.BookSpecification;
import com.blaze.elmis.util.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.blaze.elmis.util.CsvHelper;
import com.blaze.elmis.util.PdfHelper;

@Service
@RequiredArgsConstructor
public class BookService {

    private final UserRepository userRepository; // Inject UserRepository
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final BookReviewRepository bookReviewRepository; // Inject BookReviewRepository
    private final BookReviewMapper bookReviewMapper; // Inject BookReviewMapper

    public Page<BookDto> getAllBooks(Pageable pageable, String title, String author, String isbn, Long categoryId, Long subcategoryId) {
        Specification<Book> spec = BookSpecification.searchBooks(title, author, isbn, categoryId, subcategoryId);
        return bookRepository.findAll(spec, pageable).map(bookMapper::bookToBookDto);
    }

    public BookDto getBookById(Long id) {
        return bookRepository.findById(id)
                .map(bookMapper::bookToBookDto)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public BookDto createBook(BookDto bookDto) {
        Book book = bookMapper.bookDtoToBook(bookDto);

        // Set Category
        if (bookDto.getCategory() != null && bookDto.getCategory().getId() != null) {
            Category category = categoryRepository.findById(bookDto.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            book.setCategory(category);
        }

        // Set Subcategory
        if (bookDto.getSubcategory() != null && bookDto.getSubcategory().getId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(bookDto.getSubcategory().getId())
                    .orElseThrow(() -> new RuntimeException("Subcategory not found"));
            book.setSubcategory(subcategory);
        }

        return bookMapper.bookToBookDto(bookRepository.save(book));
    }

    public BookDto updateBook(Long id, BookDto bookDto) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // Update basic fields
        existingBook.setTitle(bookDto.getTitle());
        existingBook.setAuthor(bookDto.getAuthor());
        existingBook.setIsbn(bookDto.getIsbn());
        existingBook.setPublisher(bookDto.getPublisher());
        existingBook.setPublicationYear(bookDto.getPublicationYear());
        // existingBook.setGenre(bookDto.getGenre()); // Genre is removed
        existingBook.setQuantity(bookDto.getQuantity());
        existingBook.setAvailableQuantity(bookDto.getAvailableQuantity());

        // Update Category
        if (bookDto.getCategory() != null && bookDto.getCategory().getId() != null) {
            Category category = categoryRepository.findById(bookDto.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existingBook.setCategory(category);
        } else {
            // Handle case where category might be removed or set to null
            existingBook.setCategory(null);
        }

        // Update Subcategory
        if (bookDto.getSubcategory() != null && bookDto.getSubcategory().getId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(bookDto.getSubcategory().getId())
                    .orElseThrow(() -> new RuntimeException("Subcategory not found"));
            existingBook.setSubcategory(subcategory);
        } else {
            // Handle case where subcategory might be removed or set to null
            existingBook.setSubcategory(null);
        }

        return bookMapper.bookToBookDto(bookRepository.save(existingBook));
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    // Excel Import
    public void importBooksFromExcel(MultipartFile file) {
        if (!ExcelHelper.TYPE.equals(file.getContentType())) {
            throw new RuntimeException("Only Excel files are allowed!");
        }

        List<BookDto> bookDtos = ExcelHelper.excelToBooks(file);
        for (BookDto bookDto : bookDtos) {
            // Here you would typically map BookDto to Book entity and save it.
            // For simplicity, we'll assume the BookDto contains enough info or we fetch category/subcategory IDs.
            // For now, we'll just call createBook, which handles fetching category/subcategory by ID.
            // Note: This assumes the IDs in the Excel file are valid.
            createBook(bookDto);
        }
    }

    // Excel Export
    public ResponseEntity<Resource> exportBooksToExcel() {
        List<BookDto> books = bookRepository.findAll().stream()
                .map(bookMapper::bookToBookDto)
                .collect(Collectors.toList());

        ByteArrayInputStream stream = ExcelHelper.booksToExcel(books);
        InputStreamResource resource = new InputStreamResource(stream);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=books.xlsx");
        headers.set(HttpHeaders.CONTENT_TYPE, ExcelHelper.TYPE);

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

    // CSV Export
    public ResponseEntity<Resource> exportBooksToCsv() {
        List<BookDto> books = bookRepository.findAll().stream()
                .map(bookMapper::bookToBookDto)
                .collect(Collectors.toList());

        ByteArrayInputStream stream = CsvHelper.booksToCsv(books);
        InputStreamResource resource = new InputStreamResource(stream);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=books.csv");
        headers.set(HttpHeaders.CONTENT_TYPE, CsvHelper.TYPE);

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

    // PDF Export
    public ResponseEntity<Resource> exportBooksToPdf() {
        List<BookDto> books = bookRepository.findAll().stream()
                .map(bookMapper::bookToBookDto)
                .collect(Collectors.toList());

        ByteArrayInputStream stream = PdfHelper.booksToPdf(books);
        InputStreamResource resource = new InputStreamResource(stream);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=books.pdf");
        // Set content type for PDF
        headers.set(HttpHeaders.CONTENT_TYPE, "application/pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

    // --- Book Review Methods ---

    public List<BookReviewDto> getReviewsForBook(Long bookId) {
        // Fetch reviews using the repository
        List<BookReview> reviews = bookReviewRepository.findByBookId(bookId);
        // Map reviews to DTOs
        return reviews.stream()
                .map(bookReviewMapper::bookReviewToBookReviewDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookReviewDto addReviewToBook(Long bookId, BookReviewDto reviewDto) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        User user = userRepository.findById(reviewDto.getUserId())
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
    public BookReviewDto updateBookReview(Long reviewId, BookReviewDto reviewDto) {
        BookReview existingReview = bookReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Optional: Add authorization check here to ensure only the user who wrote the review can update it.

        Book book = existingReview.getBook(); // Get the book associated with the review

        existingReview.setRating(reviewDto.getRating());
        existingReview.setComment(reviewDto.getComment());

        BookReview updatedReview = bookReviewRepository.save(existingReview);
        updateBookRating(book); // Re-calculate rating as it might have changed
        return bookReviewMapper.bookReviewToBookReviewDto(updatedReview);
    }

    @Transactional
    public void deleteBookReview(Long reviewId) {
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
}
