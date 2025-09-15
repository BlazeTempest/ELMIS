package com.blaze.elmis.mapper;

import com.blaze.elmis.dto.RentalDto;
import com.blaze.elmis.model.Rental;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RentalMapper {

    @Mapping(source = "book.id", target = "bookId")
    @Mapping(source = "user.id", target = "userId")
    RentalDto rentalToRentalDto(Rental rental);

    @Mapping(source = "bookId", target = "book.id")
    @Mapping(source = "userId", target = "user.id")
    Rental rentalDtoToRental(RentalDto rentalDto);
}
