package com.example.response;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerResponse { //TODO add response to include threads used
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
