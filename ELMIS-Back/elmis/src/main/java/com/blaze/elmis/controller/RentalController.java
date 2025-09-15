package com.blaze.elmis.controller;

import com.blaze.elmis.dto.RentalDto;
import com.blaze.elmis.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @GetMapping
    public Page<RentalDto> getAllRentals(Pageable pageable) {
        return rentalService.getAllRentals(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalDto> getRentalById(@PathVariable Long id) {
        return ResponseEntity.ok(rentalService.getRentalById(id));
    }

    @PostMapping
    public ResponseEntity<RentalDto> createRental(@RequestBody RentalDto rentalDto) {
        return ResponseEntity.ok(rentalService.createRental(rentalDto));
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<RentalDto> returnRental(@PathVariable Long id) {
        return ResponseEntity.ok(rentalService.returnRental(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        rentalService.deleteRental(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/overdue/{id}")
    public ResponseEntity<RentalDto> markRentalAsOverdue(@PathVariable Long id) {
        return ResponseEntity.ok(rentalService.markAsOverdue(id));
    }
}
