package com.blaze.elmis.service;

import com.blaze.elmis.dto.AnnouncementDto;
import com.blaze.elmis.mapper.AnnouncementMapper;
import com.blaze.elmis.model.Announcement;
import com.blaze.elmis.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementMapper announcementMapper;

    public Page<AnnouncementDto> getAllAnnouncements(Pageable pageable) {
        return announcementRepository.findAll(pageable).map(announcementMapper::announcementToAnnouncementDto);
    }

    public AnnouncementDto getAnnouncementById(Long id) {
        return announcementRepository.findById(id)
                .map(announcementMapper::announcementToAnnouncementDto)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
    }

    public AnnouncementDto createAnnouncement(AnnouncementDto announcementDto) {
        Announcement announcement = announcementMapper.announcementDtoToAnnouncement(announcementDto);
        return announcementMapper.announcementToAnnouncementDto(announcementRepository.save(announcement));
    }

    public AnnouncementDto updateAnnouncement(Long id, AnnouncementDto announcementDto) {
        Announcement existingAnnouncement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        existingAnnouncement.setTitle(announcementDto.getTitle());
        existingAnnouncement.setContent(announcementDto.getContent());
        return announcementMapper.announcementToAnnouncementDto(announcementRepository.save(existingAnnouncement));
    }

    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}
