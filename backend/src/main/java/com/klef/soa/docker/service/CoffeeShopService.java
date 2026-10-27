package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.CoffeeShopRequest;
import com.klef.soa.docker.dto.CoffeeShopResponse;

public interface CoffeeShopService
{
    CoffeeShopResponse saveCoffeeShop(CoffeeShopRequest request);

    List<CoffeeShopResponse> getAllCoffeeShops();

    CoffeeShopResponse getCoffeeShopById(Long id);

    CoffeeShopResponse updateCoffeeShop(Long id, CoffeeShopRequest request);

    void deleteCoffeeShop(Long id);
}