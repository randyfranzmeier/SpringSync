export class Player {
    time;
    playersCreated;

    constructor(playersCreated, time) {
        this.playersCreated = playersCreated;
        this.time = time;
    }

}

export class ThreadedPlayerRequest {
    numThreads;
    numPlayers;

    constructor(numThreads, numPlayers) {
        this.numThreads = numThreads;
        this.numPlayers = numPlayers;
    }

}
