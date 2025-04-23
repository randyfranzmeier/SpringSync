package com.example.request;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Data
@NoArgsConstructor
public class ThreadedCounter {
    private int numThreads;
    private int loopLimit;
}
