package com.blaze.elmis.repository;

import com.blaze.elmis.model.Rental;
import com.blaze.elmis.model.RentalStatus; // Ensure RentalStatus is imported
import com.blaze.elmis.model.Role; // Import Role enum
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Import Query annotation
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {

    List<Rental> findByStatusAndDueDateBefore(RentalStatus status, LocalDateTime dueDate);

    // Method to find rentals processed by users with a specific role (e.g., EMPLOYEE)
    @Query("SELECT r FROM Rental r JOIN User u ON r.user.id = u.id WHERE u.role = :role")
    List<Rental> findByEmployeeRole(Role role);
}
