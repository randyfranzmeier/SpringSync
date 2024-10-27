package com.example.entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerResponse {
    Long time;
    int playersCreated;
    public PlayerResponse(Long time, int playersCreated) {
        this.time = time;
        this.playersCreated = playersCreated;
    }

    @Override public String toString() {
        return "PlayerResponse [time=" + time + ", playersCreated=" + playersCreated + "]";
    }
}
