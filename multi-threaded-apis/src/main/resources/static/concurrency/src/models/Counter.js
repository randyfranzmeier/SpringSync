export class CounterResponse {
    timeToComplete;
    endValue;
    constructor (timeToComplete, endValue) {
        this.timeToComplete = timeToComplete;
        this.endValue = endValue;
    }
}

export class CounterRequest {
    numThreads;
    loopLimit;
    constructor(numThreads, loopLimit) {
        this.numThreads = numThreads;
        this.loopLimit = loopLimit;
    }
}