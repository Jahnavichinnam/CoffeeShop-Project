package com.klef.soa.docker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class CoffeeShopRequest
{
    @NotBlank(message = "Shop name is required")
    private String shopName;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Average price is required")
    @PositiveOrZero(message = "Average price must be zero or greater")
    private Double averagePrice;

    @NotNull(message = "Open status is required")
    private Boolean open;
}