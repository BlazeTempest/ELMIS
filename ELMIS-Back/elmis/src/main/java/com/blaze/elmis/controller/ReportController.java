package com.blaze.elmis.controller;

import com.blaze.elmis.model.Book;
import com.blaze.elmis.model.Rental;
import com.blaze.elmis.service.ReportService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/popular-books")
    public List<Book> getMostPopularBooks() {
        return reportService.getMostPopularBooks();
    }

    @GetMapping("/active-rentals")
    public List<Rental> getActiveRentals() {
        return reportService.getActiveRentals();
    }

    @GetMapping("/rental-summary")
    public Map<String, Long> getRentalSummary() {
        return reportService.getRentalSummary();
    }

    @GetMapping("/returned-rentals")
    public List<Rental> getReturnedRentals() {
        return reportService.getReturnedRentals();
    }

    @GetMapping("/overdue-rentals")
    public List<Rental> getOverdueRentals() {
        return reportService.getOverdueRentals();
    }

    @GetMapping("/export/overdue-rentals/csv")
    public void exportOverdueRentalsToCsv(HttpServletResponse response) throws IOException {
        reportService.exportOverdueRentalsToCsv(response);
    }

    @GetMapping("/export/overdue-rentals/pdf")
    public void exportOverdueRentalsToPdf(HttpServletResponse response) throws IOException {
        reportService.exportOverdueRentalsToPdf(response);
    }
}
