package com.example.multithreadedapis.controller;

import com.example.entity.Player;
import com.example.multithreadedapis.services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PlayerController {
    //inject service
    PlayerService playerService;
    //Automatic dependency injection
    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/player/nothreading")
    public ResponseEntity<Player> getPlayerNoThreading() { //to get a path variable, use @PathVariable annotation
        return ResponseEntity.ok(PlayerService.CreateAndGetRandomPlayer());
    }


}
