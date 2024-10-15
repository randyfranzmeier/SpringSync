package com.example.multithreadedapis.services;

import com.example.entity.Player;
import com.example.entity.Sport;
import com.example.entity.Team;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class PlayerService {
    public PlayerService() {
    }

    public static Player CreateAndGetRandomPlayer() {
        List<Player> players = new ArrayList<Player>();
        players.add(new Player(1, "Babe", "Ruth", 129, new Team("Yankees", Sport.Baseball)));
        players.add(new Player(2, "Justin", "Jefferson", 25, new Team("Vikings", Sport.Football)));
        players.add(new Player(3, "Michael", "Jordan", 61, new Team("Bulls", Sport.Basketball)));
        players.add(new Player(4, "Wayne", "Gretzky", 63, new Team("Rangers", Sport.Hockey)));
        players.add(new Player(5, "Christiano", "Ronaldo", 39, new Team("Al-Nassr", Sport.Soccer)));

        Random r = new Random();
        int randomPlayer = r.nextInt(5 - 1 + 1) + 1;
        return players.stream().filter(player -> player.getId() == randomPlayer).findFirst().get();
    }
}
