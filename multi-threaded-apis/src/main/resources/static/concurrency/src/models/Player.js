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

// For frontend to handle player creation and error handling
export class PlayerHandler {
    errorText;
    error;
    buttonText;
    isWaiting;

    constructor(errorText, error, buttonText, isWaiting) {
        this.errorText = errorText;
        this.error = error;
        this.buttonText = buttonText;
        this.isWaiting = isWaiting;
    }
}