package com.blaze.elmis.util;

import com.blaze.elmis.dto.BookDto;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Component
public class CsvHelper {

    public static final String TYPE = "text/csv";

    public static ByteArrayInputStream booksToCsv(List<BookDto> books) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVPrinter csvPrinter = new CSVPrinter(new java.io.OutputStreamWriter(out), CSVFormat.DEFAULT.withHeader(
                     "ID", "Title", "Author", "ISBN", "Publisher", "Publication Year", "Quantity", "Available Quantity", "Category", "Subcategory", "Avg Rating", "Total Reviews"
             ))) {

            for (BookDto book : books) {
                csvPrinter.printRecord(
                        book.getId(),
                        book.getTitle(),
                        book.getAuthor(),
                        book.getIsbn(),
                        book.getPublisher(),
                        book.getPublicationYear(),
                        book.getQuantity(),
                        book.getAvailableQuantity(),
                        book.getCategory() != null ? book.getCategory().getName() : "", // Assuming CategoryDto has getName()
                        book.getSubcategory() != null ? book.getSubcategory().getName() : "", // Assuming SubcategoryDto has getName()
                        book.getAvgRating(),
                        book.getTotalReviews()
                );
            }
            csvPrinter.flush();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to CSV file: " + e.getMessage());
        }
    }
}
