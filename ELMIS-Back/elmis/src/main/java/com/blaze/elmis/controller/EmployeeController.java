package com.blaze.elmis.controller;

import com.blaze.elmis.dto.EmployeeDto;
import com.blaze.elmis.service.EmployeeService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor // Use @RequiredArgsConstructor for constructor injection
public class EmployeeController {

    private final EmployeeService employeeService;

    // CRUD Endpoints

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<EmployeeDto> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        Optional<EmployeeDto> employee = employeeService.getEmployeeById(id);
        return employee.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto employeeDto) {
        // The service layer handles setting createdByUserId from DTO or security context
        EmployeeDto createdEmployee = employeeService.createEmployee(employeeDto); // Correctly calls service method
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDto employeeDto) {
        // The service layer handles setting createdByUserId from DTO or security context
        EmployeeDto updatedEmployee = employeeService.updateEmployee(id, employeeDto); // Assuming this returns EmployeeDto
        if (updatedEmployee != null) {
            return ResponseEntity.ok(updatedEmployee);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    // Export Endpoints (CSV/PDF)
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportEmployeesToCsv(HttpServletResponse response) throws IOException {
        byte[] csvData = employeeService.exportEmployeesToCsv();
        String fileName = "employees.csv";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
        headers.setContentDispositionFormData("attachment", fileName);
        headers.setContentLength(csvData.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportEmployeesToPdf(HttpServletResponse response) throws IOException {
        byte[] pdfData = employeeService.exportEmployeesToPdf();
        String fileName = "employees.pdf";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", fileName);
        headers.setContentLength(pdfData.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfData);
    }

    // TODO: Add endpoints for pagination and filtering
}
