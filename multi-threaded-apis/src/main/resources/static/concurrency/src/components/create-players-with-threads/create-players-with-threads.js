import React, {useRef, useState} from 'react';
import { PlayersWithThreadsWrapper } from './create-players-with-threads.styled';
import {Alert, Button, Grid2, LinearProgress, TextField} from "@mui/material";
import {ResponseContainer, TopMargin} from "../shared/component-styles";
import {PLAYER} from "../../constants/Players";
import {API_URLS} from "../../constants/endpoints";
import {Player, ThreadedPlayerRequest} from "../../models/Player";

//TODO merge these components together. Remember DRY
function ThreadedPlayers() {
    let controller = useRef(null);
    let numberThreadsRef = useRef(0);
    let numberPlayersRef = useRef(0);
    const [errorText, setErrorText] = useState("");
    const [error, setError] = useState(false);
    const [response, setResponse] = useState(null);
    const [isWaiting, setIsWaiting] = useState(false);
    const [buttonText, setButtonText] = useState("Create");


    let ValidateNumPlayers = () => {
        if (numberPlayersRef.current.value.length === 0) {
            setError(true);
            setErrorText("Please enter the number of players");
            setButtonText('Create');
            return false;
        }
        else if (numberPlayersRef.current.value <= 0) {
            setError(true);
            setErrorText("You must create at least 1 player");
            setButtonText('Create');
            return false;
        }
        else if (numberPlayersRef.current.value > PLAYER.CREATE_LIMIT) {
            setError(true);
            setErrorText(`You must enter a number less than or equal to ${PLAYER.CREATE_LIMIT}`);
            setButtonText('Create');
            return false;
        }
        else {
            return true;
        }
    }

    let getPlayersAsync = async () => {
        const body = new ThreadedPlayerRequest(Number(numberThreadsRef.current.value), Number(numberPlayersRef.current.value));
        console.log("players: ", body);
        return fetch(API_URLS.CreatePlayersWithThreads, {
            method: "POST",
            signal: controller.current.signal,
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    }

    let CreatePlayersMultipleThreads = async () => {
        let newButtonText = buttonText === "Create"? "Cancel": "Create";
        setButtonText(newButtonText);
        if (newButtonText === "Create") {
            //cancel
            controller.current?.abort();
            setIsWaiting(false);
            setResponse(null);
        }
        else {
            if (ValidateNumPlayers()) {
                //reset response
                setResponse(null);
                controller.current = new AbortController();
                // eliminate existing error messages
                setError(false);
                setIsWaiting(true);
                const res = await getPlayersAsync().catch(error => console.log('err: ', error));
                if (res?.ok) {
                    let playerResponse = await res.json();
                    let player = await new Player(playerResponse.playersCreated, playerResponse.time);
                    setIsWaiting(false);
                    setButtonText("Create")
                    setResponse(player)
                }
            }
        }
    }
    return (
        <PlayersWithThreadsWrapper>
            <h4>Enter the number of threads to use to generate each player</h4>
            <Grid2 container spacing={2}>
                {error && <Grid2 size={12}>
                    <Alert severity="error" onClose={() =>{setError(false)}}>{errorText}</Alert>
                </Grid2>}
                <Grid2 size={4}>
                    <TextField label="Number of players" color="secondary" inputRef={numberPlayersRef} type="number" />
                </Grid2>
                <Grid2 size={4}>
                    <TextField label="Threads" color="secondary" inputRef={numberThreadsRef} type="number" />
                </Grid2>
                <Grid2 size={4}>
                    <Button variant="outlined" onClick={CreatePlayersMultipleThreads}>{buttonText}</Button>
                </Grid2>
            </Grid2>
            {isWaiting && <Grid2 size={12}>
                <TopMargin>
                    <LinearProgress />
                </TopMargin>
            </Grid2>}
            {response && <ResponseContainer>
                <div style={{width: 50 + "%",  border: 1 + "px " + "solid " + "#e0dcdc"}}>
                    <h3>Response Details</h3>
                    <h4>Time: {response.time} ms</h4>
                    <h4>Players Created: {response.playersCreated}</h4>
                </div>
            </ResponseContainer>}
        </PlayersWithThreadsWrapper>
    );
}

ThreadedPlayers.propTypes = {};


export default ThreadedPlayers;
