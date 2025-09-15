package com.blaze.elmis.controller;

import com.blaze.elmis.service.ExportService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;

    @GetMapping("/csv/books")
    public void exportBooksToCsv(HttpServletResponse response) throws IOException {
        exportService.exportBooksToCsv(response);
    }

    @GetMapping("/pdf/books")
    public void exportBooksToPdf(HttpServletResponse response) throws IOException {
        exportService.exportBooksToPdf(response);
    }
}
