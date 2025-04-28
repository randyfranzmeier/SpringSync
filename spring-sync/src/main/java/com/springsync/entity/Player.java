package com.springsync.entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Player {
    private int id;
    private String firstname;
    private String lastname;
    private int age;
    private Team team;

    public Player(int id, String firstname, String lastname, int age, Team team) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
        this.team = team;
    }

    // Default constructor
    Player() {

    }

}
