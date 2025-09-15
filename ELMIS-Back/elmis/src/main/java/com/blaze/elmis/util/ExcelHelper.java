package com.blaze.elmis.util;

import com.blaze.elmis.dto.BookDto;
import com.blaze.elmis.dto.CategoryDto;
import com.blaze.elmis.dto.SubcategoryDto;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Component
public class ExcelHelper {

    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    static String[] HEADERs = { "Id", "Title", "Author", "ISBN", "Publisher", "Publication Year", "Quantity", "Available Quantity", "Category Id", "Subcategory Id" };
    static String SHEET = "Books";

    public static ByteArrayInputStream booksToExcel(List<BookDto> books) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(SHEET);

            Row headerRow = sheet.createRow(0);

            for (int i = 0; i < HEADERs.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(HEADERs[i]);
            }

            int rowNum = 1;
            for (BookDto book : books) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(book.getId());
                row.createCell(1).setCellValue(book.getTitle());
                row.createCell(2).setCellValue(book.getAuthor());
                row.createCell(3).setCellValue(book.getIsbn());
                row.createCell(4).setCellValue(book.getPublisher());
                row.createCell(5).setCellValue(book.getPublicationYear());
                row.createCell(6).setCellValue(book.getQuantity());
                row.createCell(7).setCellValue(book.getAvailableQuantity());
                if (book.getCategory() != null) {
                    row.createCell(8).setCellValue(book.getCategory().getId());
                }
                if (book.getSubcategory() != null) {
                    row.createCell(9).setCellValue(book.getSubcategory().getId());
                }
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
        }
    }

    public static List<BookDto> excelToBooks(MultipartFile file) {
        List<BookDto> books = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheet(SHEET);
            if (sheet == null) {
                throw new RuntimeException("Sheet not found: " + SHEET);
            }

            Row headerRow = sheet.getRow(0);
            // Declare row here
            Row row = null;
            if (headerRow == null || headerRow.getLastCellNum() != HEADERs.length) {
                 throw new RuntimeException("Invalid header row or number of columns");
            }

            // Basic header validation (can be more robust)
            for (int i = 0; i < HEADERs.length; i++) {
                Cell cell = headerRow.getCell(i);
                if (cell == null || !cell.getStringCellValue().equals(HEADERs[i])) {
                    throw new RuntimeException("Invalid header: Expected '" + HEADERs[i] + "' but found '" + (cell == null ? "null" : cell.getStringCellValue()) + "'");
                }
            }

            int rowNum = 1;
            for (row = sheet.iterator().next(); row != null; row = sheet.iterator().hasNext() ? sheet.iterator().next() : null) { // Corrected loop to iterate through rows
                if (rowNum == 1 && row.getCell(0).getStringCellValue().equals("Id")) { // Skip header row if it's the first row
                    rowNum++;
                    continue;
                }
                if (row.getRowNum() == 0) { // Skip the actual header row
                    continue;
                }

                if (row.getCell(1) == null || row.getCell(1).getStringCellValue().trim().isEmpty()) {
                    // Skip rows with no title
                    continue;
                }

                BookDto book = new BookDto();
                book.setId((long) row.getCell(0).getNumericCellValue());
                book.setTitle(row.getCell(1).getStringCellValue());
                book.setAuthor(row.getCell(2).getStringCellValue());
                book.setIsbn(row.getCell(3).getStringCellValue());
                book.setPublisher(row.getCell(4).getStringCellValue());
                book.setPublicationYear((int) row.getCell(5).getNumericCellValue());
                book.setQuantity((int) row.getCell(6).getNumericCellValue());
                book.setAvailableQuantity((int) row.getCell(7).getNumericCellValue());

                // Handle Category and Subcategory IDs
                Cell categoryIdCell = row.getCell(8);
                if (categoryIdCell != null && categoryIdCell.getCellType() == CellType.NUMERIC) {
                    book.setCategory(CategoryDto.builder().id((long) categoryIdCell.getNumericCellValue()).build());
                }

                Cell subcategoryIdCell = row.getCell(9);
                if (subcategoryIdCell != null && subcategoryIdCell.getCellType() == CellType.NUMERIC) {
                    book.setSubcategory(SubcategoryDto.builder().id((long) subcategoryIdCell.getNumericCellValue()).build());
                }

                books.add(book);
                rowNum++;
            }
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Error processing Excel file: " + e.getMessage());
        }
        return books;
    }
}
