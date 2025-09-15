package com.blaze.elmis.controller;

import com.blaze.elmis.dto.AnnouncementDto;
import com.blaze.elmis.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public Page<AnnouncementDto> getAllAnnouncements(Pageable pageable) {
        return announcementService.getAllAnnouncements(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDto> getAnnouncementById(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.getAnnouncementById(id));
    }

    @PostMapping
    public ResponseEntity<AnnouncementDto> createAnnouncement(@RequestBody AnnouncementDto announcementDto) {
        return ResponseEntity.ok(announcementService.createAnnouncement(announcementDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDto> updateAnnouncement(@PathVariable Long id, @RequestBody AnnouncementDto announcementDto) {
        return ResponseEntity.ok(announcementService.updateAnnouncement(id, announcementDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }
}
