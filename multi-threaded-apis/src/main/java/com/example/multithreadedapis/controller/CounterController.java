package com.example.multithreadedapis.controller;
import com.example.multithreadedapis.services.CounterService;
import com.example.request.ThreadedCounter;
import com.example.response.ThreadedCounterResult;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/counter")
public class CounterController {
    CounterService counterService;
    @Autowired
    public CounterController(CounterService counterService) {
        this.counterService = counterService;
    }

    @PostMapping(value = "", produces = {"application/json"})
    public ResponseEntity<String> timeToIncrementValueUsingThreads(@RequestBody ThreadedCounter request) {
        // Validate user input
        if (request.getLoopLimit() <= 0 ||  request.getNumThreads() > 20 || request.getNumThreads() < 1) {
            return ResponseEntity.badRequest().body("");
        }
        try {
            ThreadedCounterResult response = counterService.handleThreadedCounter(request.getNumThreads(), request.getLoopLimit());
            // Serialize data
            ObjectMapper mapper = new ObjectMapper();
            mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            return ResponseEntity.ok(mapper.writeValueAsString(response));
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("");
        }
    }




}