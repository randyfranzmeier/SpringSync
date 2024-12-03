package com.example.multithreadedapis.controller;
import com.example.response.PlayerResponse;
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

        playerService.CreateNumPlayersSingleThread(numPlayers);

        long endTime = System.currentTimeMillis();
        PlayerResponse pr = new PlayerResponse(endTime-startTime, numPlayers);
        ObjectMapper mapper = new ObjectMapper();
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        return ResponseEntity.ok(mapper.writeValueAsString(pr));
    }

    @GetMapping("/player/{numPlayers}/threadpool/{numThreads}")
    public ResponseEntity<String> getPlayerThreadPool(@PathVariable int numPlayers, @PathVariable int numThreads) throws InterruptedException {
        try {
            if (numThreads < 1 || numThreads > 20) {
                return ResponseEntity.badRequest().body("");
            }
            long startTime = System.currentTimeMillis();

            playerService.CreateNumPlayersMultiThread(numPlayers, numThreads);

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
