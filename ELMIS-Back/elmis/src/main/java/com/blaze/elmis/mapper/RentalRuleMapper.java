package com.blaze.elmis.mapper;

import com.blaze.elmis.dto.RentalRuleDto;
import com.blaze.elmis.model.RentalRule;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RentalRuleMapper {

    RentalRuleDto rentalRuleToRentalRuleDto(RentalRule rentalRule);

    RentalRule rentalRuleDtoToRentalRule(RentalRuleDto rentalRuleDto);
}
