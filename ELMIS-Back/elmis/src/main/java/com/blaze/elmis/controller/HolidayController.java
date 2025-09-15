package com.blaze.elmis.controller;

import com.blaze.elmis.dto.HolidayDto;
import com.blaze.elmis.service.HolidayService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/holidays")
@RequiredArgsConstructor
public class HolidayController {

    private final HolidayService holidayService;

    @GetMapping
    public Page<HolidayDto> getAllHolidays(Pageable pageable) {
        return holidayService.getAllHolidays(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HolidayDto> getHolidayById(@PathVariable Long id) {
        return ResponseEntity.ok(holidayService.getHolidayById(id));
    }

    @PostMapping
    public ResponseEntity<HolidayDto> createHoliday(@RequestBody HolidayDto holidayDto) {
        return ResponseEntity.ok(holidayService.createHoliday(holidayDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HolidayDto> updateHoliday(@PathVariable Long id, @RequestBody HolidayDto holidayDto) {
        return ResponseEntity.ok(holidayService.updateHoliday(id, holidayDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHoliday(@PathVariable Long id) {
        holidayService.deleteHoliday(id);
        return ResponseEntity.noContent().build();
    }
}
