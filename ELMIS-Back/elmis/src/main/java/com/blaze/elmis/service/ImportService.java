package com.blaze.elmis.service;

import com.blaze.elmis.model.Book;
import com.blaze.elmis.model.Category;
import com.blaze.elmis.repository.BookRepository;
import com.blaze.elmis.repository.CategoryRepository;
import com.blaze.elmis.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImportService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public void importBooks(MultipartFile file) throws IOException {
        List<Book> books = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue;
                }
                Book book = new Book();
                book.setTitle(row.getCell(1).getStringCellValue());
                book.setAuthor(row.getCell(2).getStringCellValue());
                book.setIsbn(row.getCell(3).getStringCellValue());
                book.setPublisher(row.getCell(4).getStringCellValue());
                book.setPublicationYear((int) row.getCell(5).getNumericCellValue());

                String categoryName = row.getCell(6).getStringCellValue();
                Category category = categoryRepository.findByName(categoryName)
                                        .orElseThrow(() -> new IllegalArgumentException("Category not found: " + categoryName));
                book.setCategory(category);

                book.setQuantity((int) row.getCell(7).getNumericCellValue());
                book.setAvailableQuantity((int) row.getCell(8).getNumericCellValue());
                books.add(book);
            }
        }
        bookRepository.saveAll(books);
    }
}
