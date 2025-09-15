package com.blaze.elmis.service;

import com.blaze.elmis.dto.RentalDto;
import com.blaze.elmis.mapper.RentalMapper;
import com.blaze.elmis.model.Book;
import com.blaze.elmis.model.Rental;
import com.blaze.elmis.model.RentalStatus;
import com.blaze.elmis.repository.BookRepository;
import com.blaze.elmis.repository.RentalRepository;
import com.blaze.elmis.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final RentalMapper rentalMapper;

    public Page<RentalDto> getAllRentals(Pageable pageable) {
        return rentalRepository.findAll(pageable).map(rentalMapper::rentalToRentalDto);
    }

    public RentalDto getRentalById(Long id) {
        return rentalRepository.findById(id)
                .map(rentalMapper::rentalToRentalDto)
                .orElseThrow(() -> new RuntimeException("Rental not found"));
    }

    public RentalDto createRental(RentalDto rentalDto) {
        Book book = bookRepository.findById(rentalDto.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        if (book.getAvailableQuantity() < 1) {
            throw new RuntimeException("Book not available");
        }
        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
        bookRepository.save(book);

        Rental rental = rentalMapper.rentalDtoToRental(rentalDto);
        rental.setUser(userRepository.findById(rentalDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found")));
        rental.setBook(book);
        rental.setRentalDate(LocalDateTime.now());
        rental.setDueDate(LocalDateTime.now().plusDays(14)); // Default 14 days
        rental.setStatus(RentalStatus.RENTED);
        return rentalMapper.rentalToRentalDto(rentalRepository.save(rental));
    }

    public RentalDto returnRental(Long id) {
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found"));
        rental.setReturnDate(LocalDateTime.now());
        rental.setStatus(RentalStatus.RETURNED);

        Book book = rental.getBook();
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);
        bookRepository.save(book);

        return rentalMapper.rentalToRentalDto(rentalRepository.save(rental));
    }

    public void deleteRental(Long id) {
        rentalRepository.deleteById(id);
    }

    public RentalDto markAsOverdue(Long id) {
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (rental.getStatus() == RentalStatus.RENTED && rental.getDueDate().isBefore(LocalDateTime.now())) {
            rental.setStatus(RentalStatus.OVERDUE);
            return rentalMapper.rentalToRentalDto(rentalRepository.save(rental));
        } else {
            // Optionally throw an exception or return the existing rentalDto if not overdue
            // For now, returning the existing DTO if conditions are not met
            return rentalMapper.rentalToRentalDto(rental);
        }
    }
}
