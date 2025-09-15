package com.blaze.elmis.mapper;

import com.blaze.elmis.dto.EmployeeDto;
import com.blaze.elmis.model.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(source = "createdByUser.id", target = "createdByUserId")
    @Mapping(source = "createdAt", target = "createdAt") // Assuming Employee has createdAt field
    @Mapping(source = "updatedAt", target = "updatedAt") // Assuming Employee has updatedAt field
    EmployeeDto toDto(Employee employee);

    @Mapping(source = "createdByUserId", target = "createdByUser.id")
    @Mapping(source = "createdAt", target = "createdAt") // Assuming EmployeeDto has createdAt field
    @Mapping(source = "updatedAt", target = "updatedAt") // Assuming EmployeeDto has updatedAt field
    Employee toEntity(EmployeeDto employeeDto);

    // Method to update an existing entity from a DTO
    @Mapping(source = "createdByUserId", target = "createdByUser.id")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "updatedAt", target = "updatedAt")
    Employee updateEntity(EmployeeDto employeeDto, @MappingTarget Employee employee);
}
