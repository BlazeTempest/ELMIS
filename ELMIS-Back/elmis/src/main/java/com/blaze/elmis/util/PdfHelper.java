package com.blaze.elmis.util;

import com.blaze.elmis.dto.BookDto;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class PdfHelper {

    public static ByteArrayInputStream booksToPdf(List<BookDto> books) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Add a title
            document.add(new Paragraph("Book List"));

            // Create a PDF table
            PdfPTable table = new PdfPTable(12); // 12 columns

            // Add table headers
            table.addCell("ID");
            table.addCell("Title");
            table.addCell("Author");
            table.addCell("ISBN");
            table.addCell("Publisher");
            table.addCell("Publication Year");
            table.addCell("Quantity");
            table.addCell("Available Quantity");
            table.addCell("Category");
            table.addCell("Subcategory");
            table.addCell("Avg Rating");
            table.addCell("Total Reviews");

            // Add book data to the table
            for (BookDto book : books) {
                table.addCell(String.valueOf(book.getId()));
                table.addCell(book.getTitle());
                table.addCell(book.getAuthor());
                table.addCell(book.getIsbn());
                table.addCell(book.getPublisher() != null ? book.getPublisher() : "");
                table.addCell(book.getPublicationYear() != null ? String.valueOf(book.getPublicationYear()) : "");
                table.addCell(book.getQuantity() != null ? String.valueOf(book.getQuantity()) : "");
                table.addCell(book.getAvailableQuantity() != null ? String.valueOf(book.getAvailableQuantity()) : "");
                table.addCell(book.getCategory() != null ? book.getCategory().getName() : ""); // Assuming CategoryDto has getName()
                table.addCell(book.getSubcategory() != null ? book.getSubcategory().getName() : ""); // Assuming SubcategoryDto has getName()
                table.addCell(String.valueOf(book.getAvgRating()));
                table.addCell(String.valueOf(book.getTotalReviews()));
            }

            document.add(table);
            document.close();

        } catch (DocumentException ex) {
            throw new RuntimeException("Error generating PDF: " + ex.getMessage());
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
