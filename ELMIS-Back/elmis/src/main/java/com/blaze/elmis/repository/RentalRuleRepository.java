package com.blaze.elmis.repository;

import com.blaze.elmis.model.RentalRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentalRuleRepository extends JpaRepository<RentalRule, Long> {
}
