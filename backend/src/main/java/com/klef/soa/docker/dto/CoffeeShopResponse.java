package com.klef.soa.docker.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CoffeeShopResponse
{
    private Long id;
    private String shopName;
    private String location;
    private Double averagePrice;
    private Boolean open;
}