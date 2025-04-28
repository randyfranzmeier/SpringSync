package com.springsync.entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Team {
    private String name;
    private Sport sport;

    public Team(String name, Sport sport) {
        this.name = name;
        this.sport = sport;
    }
}
