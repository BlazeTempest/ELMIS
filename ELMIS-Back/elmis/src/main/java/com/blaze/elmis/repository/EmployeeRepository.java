package com.blaze.elmis.repository;

import com.blaze.elmis.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Add any custom query methods here if needed
}
