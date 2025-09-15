package com.blaze.elmis.mapper;

import com.blaze.elmis.dto.HolidayDto;
import com.blaze.elmis.model.Holiday;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface HolidayMapper {

    HolidayDto holidayToHolidayDto(Holiday holiday);

    Holiday holidayDtoToHoliday(HolidayDto holidayDto);
}
