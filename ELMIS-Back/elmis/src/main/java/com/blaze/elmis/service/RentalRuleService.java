package com.blaze.elmis.service;

import com.blaze.elmis.dto.RentalRuleDto;
import com.blaze.elmis.mapper.RentalRuleMapper;
import com.blaze.elmis.model.RentalRule;
import com.blaze.elmis.repository.RentalRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RentalRuleService {

    private final RentalRuleRepository rentalRuleRepository;
    private final RentalRuleMapper rentalRuleMapper;

    public Page<RentalRuleDto> getAllRentalRules(Pageable pageable) {
        return rentalRuleRepository.findAll(pageable).map(rentalRuleMapper::rentalRuleToRentalRuleDto);
    }

    public RentalRuleDto getRentalRuleById(Long id) {
        return rentalRuleRepository.findById(id)
                .map(rentalRuleMapper::rentalRuleToRentalRuleDto)
                .orElseThrow(() -> new RuntimeException("Rental rule not found"));
    }

    public RentalRuleDto createRentalRule(RentalRuleDto rentalRuleDto) {
        RentalRule rentalRule = rentalRuleMapper.rentalRuleDtoToRentalRule(rentalRuleDto);
        return rentalRuleMapper.rentalRuleToRentalRuleDto(rentalRuleRepository.save(rentalRule));
    }

    public RentalRuleDto updateRentalRule(Long id, RentalRuleDto rentalRuleDto) {
        RentalRule existingRentalRule = rentalRuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental rule not found"));
        existingRentalRule.setRuleName(rentalRuleDto.getRuleName());
        existingRentalRule.setRuleValue(rentalRuleDto.getRuleValue());
        return rentalRuleMapper.rentalRuleToRentalRuleDto(rentalRuleRepository.save(existingRentalRule));
    }

    public void deleteRentalRule(Long id) {
        rentalRuleRepository.deleteById(id);
    }
}
