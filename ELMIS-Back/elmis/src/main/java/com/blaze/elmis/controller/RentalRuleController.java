package com.blaze.elmis.controller;

import com.blaze.elmis.dto.RentalRuleDto;
import com.blaze.elmis.service.RentalRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rental-rules")
@RequiredArgsConstructor
public class RentalRuleController {

    private final RentalRuleService rentalRuleService;

    @GetMapping
    public Page<RentalRuleDto> getAllRentalRules(Pageable pageable) {
        return rentalRuleService.getAllRentalRules(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalRuleDto> getRentalRuleById(@PathVariable Long id) {
        return ResponseEntity.ok(rentalRuleService.getRentalRuleById(id));
    }

    @PostMapping
    public ResponseEntity<RentalRuleDto> createRentalRule(@RequestBody RentalRuleDto rentalRuleDto) {
        return ResponseEntity.ok(rentalRuleService.createRentalRule(rentalRuleDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentalRuleDto> updateRentalRule(@PathVariable Long id, @RequestBody RentalRuleDto rentalRuleDto) {
        return ResponseEntity.ok(rentalRuleService.updateRentalRule(id, rentalRuleDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRentalRule(@PathVariable Long id) {
        rentalRuleService.deleteRentalRule(id);
        return ResponseEntity.noContent().build();
    }
}
