package com.example.multithreadedapis.controller;
import com.example.request.ThreadedPlayer;
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

    @PostMapping("/player/threadpool")
    public ResponseEntity<String> getPlayerThreadPool(@RequestBody ThreadedPlayer request) throws InterruptedException {
        try {
            if (request.getNumThreads() < 1 || request.getNumThreads() > 20) {
                return ResponseEntity.badRequest().body("");
            }
            long startTime = System.currentTimeMillis();

            playerService.CreateNumPlayersMultiThread(request.getNumPlayers(), request.getNumThreads());

            long endTime = System.currentTimeMillis();
            PlayerResponse pr = new PlayerResponse(endTime-startTime, request.getNumPlayers());
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
