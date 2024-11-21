package com.example.multithreadedapis.services;

import com.example.response.ThreadedCounterResult;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Getter
@Setter
@Service
public class CounterService {

private final ReadWriteLock lock = new ReentrantReadWriteLock();

private int value;
private int loopLimit;

//public int getValueSync() {
//    lock.readLock().lock();
//    int val = this.getValue();
//    lock.readLock().unlock();
//    return val;
//}
//
//public void setValueSync(int value) {
//    lock.writeLock().lock();
//    this.setValue(value);
//    lock.writeLock().unlock();
//}
//
//    public void increment() {
//    int val = this.getValueSync();
//        while (val <= this.getLoopLimit()) {
//            this.setValueSync(val++);
//        }
//    }

    public synchronized void increment() {
        System.out.println(Thread.currentThread().getName() + " increment" + " value: " + value);
        while(this.getValue() < this.getLoopLimit()) {
            this.setValue(this.getValue() + 1);
        }
    }

    public ThreadedCounterResult handleThreadedCounter(int numThreads, int loopLimit) {
        // Set up variables
        this.setValue(0);
        this.setLoopLimit(loopLimit);

        try {
            ExecutorService executor = Executors.newFixedThreadPool(numThreads);
            long startTime = System.currentTimeMillis();
            // create threads
            for (int i = 0; i < numThreads; i++) {
                executor.execute(this::increment);
            }
            // wait for threads to finish
            executor.shutdown();
            while (!executor.isTerminated()) {
            }
            // calculate time took to complete
            long endTime = System.currentTimeMillis();
            long totalTime = endTime - startTime;
            return new ThreadedCounterResult(totalTime, this.getValue());
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
