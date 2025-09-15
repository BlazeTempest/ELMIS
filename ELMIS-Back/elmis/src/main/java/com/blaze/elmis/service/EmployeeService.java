package com.blaze.elmis.service;

import com.blaze.elmis.dto.EmployeeDto;
import com.blaze.elmis.model.Employee;
import com.blaze.elmis.model.User;
import com.blaze.elmis.repository.EmployeeRepository;
import com.blaze.elmis.mapper.EmployeeMapper;
import com.blaze.elmis.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import com.lowagie.text.Document;
import com.lowagie.text.Chunk;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeMapper employeeMapper;

    @Autowired
    private UserRepository userRepository;

    // CRUD Operations

    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
    }

    public Optional<EmployeeDto> getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .map(employeeMapper::toDto);
    }

    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = employeeMapper.toEntity(employeeDto);

        // --- Audit Fields Logic ---
        // TODO: Inject a service to get the current user's ID and User object.
        // For now, using placeholders.
        // Assuming Employee entity has: User createdByUser, LocalDateTime createdAt, LocalDateTime updatedAt
        // And EmployeeDto has: Long createdByUserId
        // The mapper maps createdByUserId to createdByUser.id.
        // So, if employeeDto has createdByUserId, it will be mapped.
        // If not, we need to set it.

        // --- Audit Fields Logic ---
        // TODO: Inject a service to get the current user's ID and User object.
        // For now, using placeholders.
        // Assuming Employee entity has: User createdByUser, LocalDateTime createdAt, LocalDateTime updatedAt
        // And EmployeeDto has: Long createdByUserId
        // The mapper maps createdByUserId to createdByUser.id.
        // So, if employeeDto has createdByUserId, it will be mapped.
        // If not, we need to set it.

        // Set createdByUser if createdByUserId is provided in DTO
        if (employeeDto.getCreatedByUserId() != null) {
            userRepository.findById(employeeDto.getCreatedByUserId())
                    .ifPresent(employee::setCreatedByUser);
        }
        // employee.setCreatedAt(LocalDateTime.now()); // Handled by @CreatedDate
        // employee.setUpdatedAt(LocalDateTime.now()); // Handled by @LastModifiedDate
        // --- End Audit Fields Logic ---

        return employeeMapper.toDto(employeeRepository.save(employee));
    }

    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto) {
        return employeeRepository.findById(id)
                .map(existingEmployee -> {
                    // Map DTO to Entity, updating existingEmployee
                    Employee updatedEmployee = employeeMapper.updateEntity(employeeDto, existingEmployee);

                    // --- Audit Fields Logic ---
                    // TODO: Inject a service to get the current user's ID and User object.
                    // For now, using placeholders.
                    // Assuming Employee entity has: User createdByUser, LocalDateTime createdAt, LocalDateTime updatedAt
                    // And EmployeeDto has: Long createdByUserId
                    // The mapper maps createdByUserId to createdByUser.id.
                    // So, if employeeDto has createdByUserId, it will be mapped.
                    // If not, we need to set it.

                    // Set createdByUser if createdByUserId is provided in DTO
                    if (employeeDto.getCreatedByUserId() != null) {
                        userRepository.findById(employeeDto.getCreatedByUserId())
                                .ifPresent(updatedEmployee::setCreatedByUser);
                    }
                    // updatedEmployee.setUpdatedAt(LocalDateTime.now()); // Handled by @LastModifiedDate
                    // --- End Audit Fields Logic ---

                    return employeeMapper.toDto(employeeRepository.save(updatedEmployee));
                })
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id)); // Consider a custom exception
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with id: " + id); // Consider a custom exception
        }
        employeeRepository.deleteById(id);
    }

    // Bulk Import Logic
    public void importEmployeesFromExcel(MultipartFile file) throws IOException {
        List<Employee> employees = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        final int[] rowNumArr = {0}; // Use an array to make rowNum effectively final

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0); // Assuming the first sheet contains employee data

            for (Row row : sheet) {
                rowNumArr[0]++; // Increment the counter
                // Skip header row
                if (rowNumArr[0] == 1) { // Using rowNumArr to skip header, assuming it's always the first row
                    continue;
                }

                EmployeeDto employeeDto = new EmployeeDto();
                try {
                    // Assuming columns are: firstName, lastName, email, phoneNumber, createdByUserId
                    // Adjust column indices as per your Excel file structure
                    employeeDto.setFirstName(getStringCellValue(row.getCell(0)));
                    employeeDto.setLastName(getStringCellValue(row.getCell(1)));
                    employeeDto.setEmail(getStringCellValue(row.getCell(2)));
                    employeeDto.setPhoneNumber(getStringCellValue(row.getCell(3)));

                    // Assuming createdByUserId is in the 5th column (index 4)
                    try {
                        if (row.getCell(4) != null && !row.getCell(4).getStringCellValue().isEmpty()) {
                            employeeDto.setCreatedByUserId(Long.parseLong(getStringCellValue(row.getCell(4))));
                        }
                    } catch (NumberFormatException e) {
                        errors.add("Row " + rowNumArr[0] + ": Invalid format for Created By User ID. Expected a number, got '" + getStringCellValue(row.getCell(4)) + "'.");
                    }

                    // Map DTO to Entity and set audit fields (handled by service logic)
                    Employee employee = employeeMapper.toEntity(employeeDto);

                    // Set createdByUser if createdByUserId is provided in DTO
                    if (employeeDto.getCreatedByUserId() != null) {
                       Optional<User> userOpt = userRepository.findById(employeeDto.getCreatedByUserId());
                        if (userOpt.isPresent()) {
                            employee.setCreatedByUser(userOpt.get());
                        } else {
                            errors.add("Row " + rowNumArr[0] + ": User with ID " + employeeDto.getCreatedByUserId() + " not found.");
                        }
                    }

                    employees.add(employee);

                } catch (Exception e) {
                    errors.add("Row " + rowNumArr[0] + ": Error processing row - " + e.getMessage());
                }
            }
        } catch (IOException e) {
            throw new IOException("Error reading Excel file", e);
        }

        if (!employees.isEmpty()) {
            employeeRepository.saveAll(employees);
        }

        if (!errors.isEmpty()) {
            // Throw a custom exception or log errors appropriately
            // For now, printing to console and throwing a generic exception
            System.err.println("Import completed with errors:");
            for (String error : errors) {
                System.err.println(error);
            }
            throw new IOException("Excel import failed with errors. Please check logs for details.");
        }
    }

    // Helper method to get String cell value, handling potential errors
    private String getStringCellValue(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString(); // Or format as needed
                } else {
                    return String.valueOf(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                // Attempt to evaluate formula and get string value
                try {
                    return cell.getStringCellValue();
                } catch (IllegalStateException e) {
                    // If formula returns a number, get it as string
                    return String.valueOf(cell.getNumericCellValue());
                }
            default:
                return "";
        }
    }

    public void importEmployeesFromCsv(MultipartFile file) throws IOException {
        // TODO: Implement CSV import using Apache Commons CSV
        // 1. Read the CSV file
        // 2. Parse each row into an Employee object
        // 3. Save employees to the database
        // 4. Handle potential errors during parsing and saving
        throw new UnsupportedOperationException("CSV import not yet implemented.");
    }

    // Export Logic (CSV/PDF) - This will likely be handled by a controller or a separate export service
    // For now, placeholder methods or delegate to a dedicated export service.
    // Example:
    // public byte[] exportEmployeesToCsv() { ... }
    // public byte[] exportEmployeesToPdf() { ... }

    // CSV Export
    public byte[] exportEmployeesToCsv() throws IOException {
        List<EmployeeDto> employees = getAllEmployees();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
             CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader("ID", "First Name", "Last Name", "Email", "Phone Number", "Created At", "Updated At", "Created By User ID"))) {

            for (EmployeeDto employee : employees) {
                csvPrinter.printRecord(
                        employee.getId(),
                        employee.getFirstName(),
                        employee.getLastName(),
                        employee.getEmail(),
                        employee.getPhoneNumber(),
                        employee.getCreatedAt(),
                        employee.getUpdatedAt(),
                        employee.getCreatedByUserId() // Assuming DTO has this
                );
            }
            csvPrinter.flush();
            return baos.toByteArray();
        }
    }

    // PDF Export
    public byte[] exportEmployeesToPdf() throws IOException {
        List<EmployeeDto> employees = getAllEmployees();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            document.add(new Paragraph("Employee List"));
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(8); // Number of columns
            table.addCell("ID");
            table.addCell("First Name");
            table.addCell("Last Name");
            table.addCell("Email");
            table.addCell("Phone Number");
            table.addCell("Created At");
            table.addCell("Updated At");
            table.addCell("Created By User ID");

            for (EmployeeDto employee : employees) {
                table.addCell(String.valueOf(employee.getId()));
                table.addCell(employee.getFirstName());
                table.addCell(employee.getLastName());
                table.addCell(employee.getEmail());
                table.addCell(employee.getPhoneNumber());
                table.addCell(employee.getCreatedAt() != null ? employee.getCreatedAt().toString() : "");
                table.addCell(employee.getUpdatedAt() != null ? employee.getUpdatedAt().toString() : "");
                table.addCell(employee.getCreatedByUserId() != null ? String.valueOf(employee.getCreatedByUserId()) : "");
            }
            document.add(table);
            document.close();
            return baos.toByteArray();
        }
    }
}
