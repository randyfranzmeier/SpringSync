package com.example.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ThreadedCounter {
    private int numThreads;
    private int loopLimit;

    public ThreadedCounter() {

    }

}
