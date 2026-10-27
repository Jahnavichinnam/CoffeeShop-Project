package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.CoffeeShopRequest;
import com.klef.soa.docker.dto.CoffeeShopResponse;
import com.klef.soa.docker.service.CoffeeShopService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequestMapping("/coffeeshop")
@CrossOrigin("*")
@RequiredArgsConstructor
public class CoffeeShopController
{
    private final CoffeeShopService service;

    @GetMapping("/")
    public String home()
    {
        return "Coffee Shop Project";
    }

    @PostMapping("/add")
    public ResponseEntity<CoffeeShopResponse> saveCoffeeShop(
            @Valid @RequestBody CoffeeShopRequest request)
    {
        return new ResponseEntity<>(
                service.saveCoffeeShop(request), HttpStatus.CREATED);
    }

    @GetMapping("/displayall")
    public ResponseEntity<List<CoffeeShopResponse>> getAllCoffeeShops()
    {
        return ResponseEntity.ok(service.getAllCoffeeShops());
    }

    @GetMapping("/display/{id}")
    public ResponseEntity<CoffeeShopResponse> getCoffeeShopById(
            @PathVariable Long id)
    {
        return ResponseEntity.ok(service.getCoffeeShopById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CoffeeShopResponse> updateCoffeeShop(
            @PathVariable Long id,
            @Valid @RequestBody CoffeeShopRequest request)
    {
        return ResponseEntity.ok(service.updateCoffeeShop(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCoffeeShop(@PathVariable Long id)
    {
        service.deleteCoffeeShop(id);

        return ResponseEntity.ok("Coffee shop deleted successfully.");
    }
}