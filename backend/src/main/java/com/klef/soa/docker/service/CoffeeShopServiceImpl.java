package com.klef.soa.docker.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.CoffeeShopRequest;
import com.klef.soa.docker.dto.CoffeeShopResponse;
import com.klef.soa.docker.entity.CoffeeShop;
import com.klef.soa.docker.exception.ResourceNotFoundException;
import com.klef.soa.docker.repository.CoffeeShopRepository;
import com.klef.soa.docker.service.CoffeeShopService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoffeeShopServiceImpl implements CoffeeShopService
{
    private final CoffeeShopRepository repository;

    @Override
    public CoffeeShopResponse saveCoffeeShop(CoffeeShopRequest request)
    {
        CoffeeShop shop = CoffeeShop.builder()
                .shopName(request.getShopName())
                .location(request.getLocation())
                .averagePrice(request.getAveragePrice())
                .open(request.getOpen())
                .build();

        CoffeeShop savedShop = repository.save(shop);

        return mapToResponse(savedShop);
    }

    @Override
    public List<CoffeeShopResponse> getAllCoffeeShops()
    {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CoffeeShopResponse getCoffeeShopById(Long id)
    {
        CoffeeShop shop = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coffee shop not found with id: " + id));

        return mapToResponse(shop);
    }

    @Override
    public CoffeeShopResponse updateCoffeeShop(
            Long id, CoffeeShopRequest request)
    {
        CoffeeShop shop = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coffee shop not found with id: " + id));

        shop.setShopName(request.getShopName());
        shop.setLocation(request.getLocation());
        shop.setAveragePrice(request.getAveragePrice());
        shop.setOpen(request.getOpen());

        CoffeeShop updatedShop = repository.save(shop);

        return mapToResponse(updatedShop);
    }

    @Override
    public void deleteCoffeeShop(Long id)
    {
        CoffeeShop shop = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coffee shop not found with id: " + id));

        repository.delete(shop);
    }

    private CoffeeShopResponse mapToResponse(CoffeeShop shop)
    {
        return CoffeeShopResponse.builder()
                .id(shop.getId())
                .shopName(shop.getShopName())
                .location(shop.getLocation())
                .averagePrice(shop.getAveragePrice())
                .open(shop.getOpen())
                .build();
    }
}