package com.springsync.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ThreadedCounterResult {
    private long timeToComplete;
    private int endValue;

    public ThreadedCounterResult(long timeToComplete, int endValue) {
        this.timeToComplete = timeToComplete;
        this.endValue = endValue;
    }

    public ThreadedCounterResult() {}

    @Override public String toString() {
        return "ThreadedCounterResult [timeToComplete=" + timeToComplete + ", endValue=" + endValue + "]";
    }

}
