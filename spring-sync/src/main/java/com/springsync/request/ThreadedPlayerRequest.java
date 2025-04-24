package com.springsync.request;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Data
@NoArgsConstructor
public class ThreadedPlayerRequest {
    private int numThreads;
    private int numPlayers;
}
