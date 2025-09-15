package com.blaze.elmis.controller;

import com.blaze.elmis.service.EmployeeService;
import com.blaze.elmis.service.ImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
public class ImportController {

    private final ImportService importService;
    private final EmployeeService employeeService;

    @PostMapping("/books")
    public ResponseEntity<Void> importBooks(@RequestParam("file") MultipartFile file) {
        try {
            importService.importBooks(file);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/employees")
    public ResponseEntity<Void> importEmployees(@RequestParam("file") MultipartFile file) {
        try {
            employeeService.importEmployeesFromExcel(file);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Log the exception for better debugging
            // logger.error("Error importing employees", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
