package com.blaze.elmis.controller;

import com.blaze.elmis.dto.BookDto;
import com.blaze.elmis.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public Page<BookDto> getAllBooks(
            Pageable pageable,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String isbn,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subcategoryId) {
        return bookService.getAllBooks(pageable, title, author, isbn, categoryId, subcategoryId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @PostMapping
    public ResponseEntity<BookDto> createBook(@RequestBody BookDto bookDto) {
        return ResponseEntity.ok(bookService.createBook(bookDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateBook(@PathVariable Long id, @RequestBody BookDto bookDto) {
        return ResponseEntity.ok(bookService.updateBook(id, bookDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<String> importBooks(@RequestParam("file") MultipartFile file) {
        try {
            bookService.importBooksFromExcel(file);
            return ResponseEntity.ok("Books imported successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/export")
    public ResponseEntity<Resource> exportBooks() {
        return bookService.exportBooksToExcel();
    }

    @GetMapping("/export/csv")
    public ResponseEntity<Resource> exportBooksCsv() {
        return bookService.exportBooksToCsv();
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<Resource> exportBooksPdf() {
        return bookService.exportBooksToPdf();
    }
}
