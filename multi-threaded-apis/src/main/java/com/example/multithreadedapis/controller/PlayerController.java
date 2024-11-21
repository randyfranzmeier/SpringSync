package com.example.multithreadedapis.controller;
import com.example.entity.PlayerResponse;
import com.example.multithreadedapis.services.PlayerService;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.*;

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

    @GetMapping(value = "/player/nothreading/{numPlayers}", produces = {"application/json"})
    public ResponseEntity<String> getPlayerNoThreading(@PathVariable int numPlayers) throws JsonProcessingException, InterruptedException { //to get a path variable, use @PathVariable annotation
        long startTime = System.currentTimeMillis();
        if (numPlayers < 1) {
            throw new IllegalArgumentException("Number of players must be greater than 0");
        }
        //do everything one thread at a time (can't reuse threads)
        for (int i = 0; i < numPlayers; i++) {
            Thread thread = new Thread (() -> {
                System.out.println(PlayerService.CreateAndGetRandomPlayer());
            });
            thread.start();
            thread.join(); //wait for thread to finish
        }
        long endTime = System.currentTimeMillis();
        PlayerResponse pr = new PlayerResponse(endTime-startTime, numPlayers);
        ObjectMapper mapper = new ObjectMapper();
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        return ResponseEntity.ok(mapper.writeValueAsString(pr));
    }

    @GetMapping("/player/thread-pool/{numPlayers}")
    public ResponseEntity<String> getPlayerThreadPool(@PathVariable int numPlayers) {
        try {
            long startTime = System.currentTimeMillis();
            ExecutorService executor = Executors.newFixedThreadPool(numPlayers);
            for (int i = 0; i < numPlayers; i++) {
                executor.submit(() -> {System.out.println(PlayerService.CreateAndGetRandomPlayer());});
            }
            executor.shutdown(); //wait for all the threads to finish, then close down the service
            long endTime = System.currentTimeMillis();
            PlayerResponse pr = new PlayerResponse(endTime-startTime, numPlayers);
            ObjectMapper mapper = new ObjectMapper();
            mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            return ResponseEntity.ok(mapper.writeValueAsString(pr));

        } catch(IllegalArgumentException e) {
            throw new IllegalArgumentException("Number of players must be greater than 0");
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


}
