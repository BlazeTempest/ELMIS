package com.blaze.elmis.service;

import com.blaze.elmis.model.Book;
import com.blaze.elmis.model.Rental;
import com.blaze.elmis.model.RentalStatus;
import com.blaze.elmis.repository.BookRepository;
import com.blaze.elmis.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import com.blaze.elmis.model.Role; // Import Role enum

@Service
@RequiredArgsConstructor
public class ReportService {

    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;
// Assuming Employee role is defined in Role enum, e.g., Role.EMPLOYEE
// If not, we might need to adjust this or ask for clarification.
// For now, let's assume Role.EMPLOYEE exists.
// If Role.ADMIN should also be included, the query in the repository would need adjustment.
// For simplicity, let's assume Role.EMPLOYEE is sufficient for now.
// If Role.ADMIN is also considered an employee for reporting, the repository query would be:
// WHERE u.role = :role OR u.role = 'ADMIN' (or similar logic)
// For now, we'll use the repository method as is, assuming it takes a specific role.
// We will pass Role.EMPLOYEE to it.

    public List<Book> getMostPopularBooks() {
        return rentalRepository.findAll().stream()
                .collect(Collectors.groupingBy(Rental::getBook, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    public List<Rental> getActiveRentals() {
        return rentalRepository.findAll().stream()
                .filter(rental -> rental.getStatus() == RentalStatus.RENTED)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getRentalSummary() {
        long totalBooks = bookRepository.count();
        long rentedBooks = rentalRepository.findAll().stream()
                .filter(rental -> rental.getStatus() == RentalStatus.RENTED)
                .count();
        // Use the repository method to find overdue rentals
        long overdueBooks = rentalRepository.findByStatusAndDueDateBefore(RentalStatus.RENTED, LocalDateTime.now()).size();
        Map<String, Long> summary = new HashMap<>();
        summary.put("totalBooks", totalBooks);
        summary.put("rentedBooks", rentedBooks);
        summary.put("overdueBooks", overdueBooks);
        return summary;
    }

    public List<Rental> getOverdueRentals() {
        // Use the repository method to find overdue rentals
        return rentalRepository.findByStatusAndDueDateBefore(RentalStatus.RENTED, LocalDateTime.now());
    }

    public List<Rental> getReturnedRentals() {
        return rentalRepository.findAll().stream()
                .filter(rental -> rental.getStatus() == RentalStatus.RETURNED)
                .collect(Collectors.toList());
    }

    // Employee Rental Activity Report
    public List<Rental> getEmployeeRentalActivity(Role employeeRole) {
        // Assuming Role.EMPLOYEE is the correct role for employees processing rentals
        // If other roles should be included, the repository query or this method needs adjustment.
        return rentalRepository.findByEmployeeRole(employeeRole);
    }

    // CSV Export for Rental Reports
    public byte[] exportRentalReportToCsv() throws IOException {
        List<Rental> rentals = rentalRepository.findAll(); // Get all rentals
        return exportRentalsToCsv(rentals, "Rental Report");
    }

    // PDF Export for Rental Reports
    public byte[] exportRentalReportToPdf() throws IOException {
        List<Rental> rentals = rentalRepository.findAll(); // Get all rentals
        return exportRentalsToPdf(rentals, "Rental Report");
    }

    // CSV Export for Overdue Rental Reports
    public void exportOverdueRentalsToCsv(HttpServletResponse response) throws IOException {
        List<Rental> overdueRentals = getOverdueRentals();
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"overdue_rentals.csv\"");
        try (OutputStreamWriter writer = new OutputStreamWriter(response.getOutputStream(), StandardCharsets.UTF_8);
             CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader("ID", "Book Title", "User Name", "Status", "Rental Date", "Due Date", "Return Date"))) {

            for (Rental rental : overdueRentals) {
                csvPrinter.printRecord(
                        rental.getId(),
                        rental.getBook().getTitle(),
                        rental.getUser().getUsername(),
                        rental.getStatus().toString(),
                        rental.getRentalDate(),
                        rental.getDueDate(),
                        rental.getReturnDate()
                );
            }
        }
    }

    // PDF Export for Overdue Rental Reports
    public void exportOverdueRentalsToPdf(HttpServletResponse response) throws IOException {
        List<Rental> overdueRentals = getOverdueRentals();
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"overdue_rentals.pdf\"");
        try (Document document = new Document()) {
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();

            document.add(new Paragraph("Overdue Rental Report"));
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(7); // Number of columns
            table.addCell("ID");
            table.addCell("Book Title");
            table.addCell("User Name");
            table.addCell("Status");
            table.addCell("Rental Date");
            table.addCell("Due Date");
            table.addCell("Return Date");

            for (Rental rental : overdueRentals) {
                table.addCell(String.valueOf(rental.getId()));
                table.addCell(rental.getBook().getTitle());
                table.addCell(rental.getUser().getUsername());
                table.addCell(rental.getStatus().toString());
                table.addCell(rental.getRentalDate() != null ? rental.getRentalDate().toString() : "");
                table.addCell(rental.getDueDate() != null ? rental.getDueDate().toString() : "");
                table.addCell(rental.getReturnDate() != null ? rental.getReturnDate().toString() : "");
            }
            document.add(table);
            document.close();
        }
    }

    // Helper method for CSV export to avoid code duplication
    private byte[] exportRentalsToCsv(List<Rental> rentals, String reportTitle) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
             CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader("ID", "Book Title", "User Name", "Status", "Rental Date", "Due Date", "Return Date"))) {

            for (Rental rental : rentals) {
                csvPrinter.printRecord(
                        rental.getId(),
                        rental.getBook().getTitle(),
                        rental.getUser().getUsername(),
                        rental.getStatus().toString(),
                        rental.getRentalDate(),
                        rental.getDueDate(),
                        rental.getReturnDate()
                );
            }
            csvPrinter.flush();
            return baos.toByteArray();
        }
    }

    // Helper method for PDF export to avoid code duplication
    private byte[] exportRentalsToPdf(List<Rental> rentals, String reportTitle) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            document.add(new Paragraph(reportTitle));
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(7); // Number of columns
            table.addCell("ID");
            table.addCell("Book Title");
            table.addCell("User Name");
            table.addCell("Status");
            table.addCell("Rental Date");
            table.addCell("Due Date");
            table.addCell("Return Date");

            for (Rental rental : rentals) {
                table.addCell(String.valueOf(rental.getId()));
                table.addCell(rental.getBook().getTitle());
                table.addCell(rental.getUser().getUsername());
                table.addCell(rental.getStatus().toString());
                table.addCell(rental.getRentalDate() != null ? rental.getRentalDate().toString() : "");
                table.addCell(rental.getDueDate() != null ? rental.getDueDate().toString() : "");
                table.addCell(rental.getReturnDate() != null ? rental.getReturnDate().toString() : "");
            }
            document.add(table);
            document.close();
            return baos.toByteArray();
        }
    }
}
