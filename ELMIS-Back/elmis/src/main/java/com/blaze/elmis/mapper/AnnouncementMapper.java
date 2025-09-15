package com.blaze.elmis.mapper;

import com.blaze.elmis.dto.AnnouncementDto;
import com.blaze.elmis.model.Announcement;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AnnouncementMapper {

    AnnouncementDto announcementToAnnouncementDto(Announcement announcement);

    Announcement announcementDtoToAnnouncement(AnnouncementDto announcementDto);

    // Add list mapping
    List<AnnouncementDto> announcementsToAnnouncementDtos(List<Announcement> announcements);
    List<Announcement> announcementDtosToAnnouncements(List<AnnouncementDto> announcementDtos);
}
