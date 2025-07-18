package com.adorsys_gis.flight.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;

@RestController
public class UserController {
    @GetMapping("/api/user/profile")
    public Principal user(Principal principal) {
        return principal;
    }
} 