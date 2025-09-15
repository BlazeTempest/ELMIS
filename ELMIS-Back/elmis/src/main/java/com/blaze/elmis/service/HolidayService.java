package com.blaze.elmis.service;

import com.blaze.elmis.dto.HolidayDto;
import com.blaze.elmis.mapper.HolidayMapper;
import com.blaze.elmis.model.Holiday;
import com.blaze.elmis.repository.HolidayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HolidayService {

    private final HolidayRepository holidayRepository;
    private final HolidayMapper holidayMapper;

    public Page<HolidayDto> getAllHolidays(Pageable pageable) {
        return holidayRepository.findAll(pageable).map(holidayMapper::holidayToHolidayDto);
    }

    public HolidayDto getHolidayById(Long id) {
        return holidayRepository.findById(id)
                .map(holidayMapper::holidayToHolidayDto)
                .orElseThrow(() -> new RuntimeException("Holiday not found"));
    }

    public HolidayDto createHoliday(HolidayDto holidayDto) {
        Holiday holiday = holidayMapper.holidayDtoToHoliday(holidayDto);
        return holidayMapper.holidayToHolidayDto(holidayRepository.save(holiday));
    }

    public HolidayDto updateHoliday(Long id, HolidayDto holidayDto) {
        Holiday existingHoliday = holidayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Holiday not found"));
        existingHoliday.setName(holidayDto.getName());
        existingHoliday.setDate(holidayDto.getDate());
        return holidayMapper.holidayToHolidayDto(holidayRepository.save(existingHoliday));
    }

    public void deleteHoliday(Long id) {
        holidayRepository.deleteById(id);
    }
}
