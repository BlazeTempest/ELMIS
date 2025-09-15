package com.blaze.elmis.service;

import com.blaze.elmis.model.Book;
import com.blaze.elmis.model.Rental;
import com.blaze.elmis.model.User;
import com.blaze.elmis.repository.BookRepository;
import com.blaze.elmis.repository.RentalRepository;
import com.blaze.elmis.repository.UserRepository;
import com.lowagie.text.Document;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final BookRepository bookRepository;
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;

    public void exportBooksToCsv(HttpServletResponse response) throws IOException {
        List<Book> books = bookRepository.findAll();
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"books.csv\"");
        try (java.io.PrintWriter writer = response.getWriter()) {
            writer.println("ID,Title,Author,ISBN,Publisher,Publication Year,Genre,Quantity,Available Quantity");
            for (Book book : books) {
                writer.println(String.format("%d,%s,%s,%s,%s,%d,%s,%d,%d",
                        book.getId(), book.getTitle(), book.getAuthor(), book.getIsbn(),
                        book.getPublisher(), book.getPublicationYear(), book.getCategory().getName(),
                        book.getQuantity(), book.getAvailableQuantity()));
            }
        }
    }

    public void exportBooksToPdf(HttpServletResponse response) throws IOException {
        List<Book> books = bookRepository.findAll();
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"books.pdf\"");
        try (Document document = new Document(PageSize.A4)) {
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();
            document.add(new Paragraph("Books"));
            PdfPTable table = new PdfPTable(9);
            table.addCell("ID");
            table.addCell("Title");
            table.addCell("Author");
            table.addCell("ISBN");
            table.addCell("Publisher");
            table.addCell("Publication Year");
            table.addCell("Genre");
            table.addCell("Quantity");
            table.addCell("Available Quantity");
            for (Book book : books) {
                table.addCell(String.valueOf(book.getId()));
                table.addCell(book.getTitle());
                table.addCell(book.getAuthor());
                table.addCell(book.getIsbn());
                table.addCell(book.getPublisher());
                table.addCell(String.valueOf(book.getPublicationYear()));
                table.addCell(book.getCategory().getName());
                table.addCell(String.valueOf(book.getQuantity()));
                table.addCell(String.valueOf(book.getAvailableQuantity()));
            }
            document.add(table);
        }
    }
}
