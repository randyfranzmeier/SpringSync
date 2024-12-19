import React, {useEffect, useRef, useState} from 'react';
import {NoThreadsPlayerWrapper, PlayersWithThreadsWrapper} from './threads-players.styled';
import {Alert, Button, Grid2, LinearProgress, TextField, Divider} from "@mui/material";
import {PLAYER} from "../../constants/Players";
import {API_URLS} from "../../constants/endpoints";
import {Player, PlayerHandler, ThreadedPlayerRequest} from "../../models/Player";
import {ResponseContainer, TopMargin} from "../shared/component-styles";
import {THREAD} from "../../constants/Threads";


function ThreadsPlayers () {

    let controller = useRef(null);
    let numberThreadsRef = useRef(0);
    let numberPlayersSingleThreadRef = useRef(0);
    let numberPlayersThreadedRef = useRef(0);
    const [singleThreadPlayerHandler, setSingleThreadPlayerHandler] = useState(new PlayerHandler("", false, "Create", false));
    const [threadedPlayerHandler, setThreadedPlayerHandler] = useState(new PlayerHandler("", false, "Create", false));
    const [multiThreadRes, setMultiThreadRes] = useState(null);
    const [singleThreadRes, setSingleThreadRes] = useState(null);


    let ValidateNumPlayers = (containsThreads) => {
        const buttonText = "Create";

        if (containsThreads && numberPlayersThreadedRef.current.value.length === 0 || !containsThreads && numberPlayersSingleThreadRef.current
            .value.length === 0) {
            const errorText = "Please enter the number of players";
            const playerHandler = new PlayerHandler(errorText, true, buttonText, false);
            containsThreads? setThreadedPlayerHandler(playerHandler): setSingleThreadPlayerHandler(playerHandler);
            return false;
        }
        else if (containsThreads && numberPlayersThreadedRef.current.value <= 0 || !containsThreads && numberPlayersSingleThreadRef.current
            .value <= 0) {
            const errorText = "You must create at least 1 player";
            const playerHandler = new PlayerHandler(errorText, true, buttonText, false);
            containsThreads? setThreadedPlayerHandler(playerHandler): setSingleThreadPlayerHandler(playerHandler);
            return false;
        }
        else if (containsThreads && numberPlayersThreadedRef.current.value > PLAYER.CREATE_LIMIT || !containsThreads &&
        numberPlayersSingleThreadRef.current.value > PLAYER.CREATE_LIMIT) {
            const errorText = `You must enter a number less than or equal to ${PLAYER.CREATE_LIMIT}`;
            const playerHandler = new PlayerHandler(errorText, true, buttonText, false);
            containsThreads? setThreadedPlayerHandler(playerHandler): setSingleThreadPlayerHandler(playerHandler);
            return false;
        }
        else {
            if (containsThreads) {
                if (numberThreadsRef.current.value.length === 0) {
                    const errorText = "Please enter the number of threads";
                    const playerHandler = new PlayerHandler(errorText, true, buttonText, false);
                    setThreadedPlayerHandler(playerHandler);
                    return false;
                }
                else if (numberThreadsRef.current.value <= 0) {
                    const errorText = "You must have at least 1 thread";
                    const playerHandler = new PlayerHandler(errorText, true, buttonText, false);
                    setThreadedPlayerHandler(playerHandler);
                    return false;
                }
                else if (numberThreadsRef.current.value > THREAD.LIMIT) {
                    const errorText = `You must enter a number less than or equal to ${THREAD.LIMIT}`;
                    const playerHandler = new PlayerHandler(errorText, true, buttonText, false);
                    setThreadedPlayerHandler(playerHandler);
                    return false;
                }
            }
            return true;
        }
    }

    let getPlayersThreadedAsync = async () => {
        const body = new ThreadedPlayerRequest(Number(numberThreadsRef.current.value), Number(numberPlayersThreadedRef.current.value));

        return fetch(API_URLS.CreatePlayersWithThreads, {
            method: "POST",
            signal: controller.current.signal,
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    }

    let getPlayersAsync = async () => {
        const fullUrl = API_URLS.CreatePlayerNoThreads + `${numberPlayersSingleThreadRef.current.value}`;

        return fetch(fullUrl, {
            method: "GET",
            signal: controller.current.signal,
            mode: "cors",
            headers: { "Content-Type": "application/json" }
        })
    }
    // Although it's good practice to not repeat yourself, I believe it's best to have different functions for API calls
    let CreatePlayersMultipleThreads = async () => {
        let newButtonText = threadedPlayerHandler.buttonText === "Create"? "Cancel": "Create";
        setThreadedPlayerHandler(new PlayerHandler("", false, newButtonText, false));
        if (newButtonText === "Create") {
            //cancel
            controller.current?.abort();
            setThreadedPlayerHandler(new PlayerHandler("", false, newButtonText, false));
            setMultiThreadRes(null);
        }
        else {
            if (ValidateNumPlayers(true)) {
                //reset response
                setMultiThreadRes(null);
                controller.current = new AbortController();
                // eliminate existing error messages
                setThreadedPlayerHandler(new PlayerHandler("", false, newButtonText, true));
                const res = await getPlayersThreadedAsync().catch(error => console.log('err: ', error));
                if (res?.ok) {
                    let playerResponse = await res.json();
                    let player = await new Player(playerResponse.playersCreated, playerResponse.time);
                    setThreadedPlayerHandler(new PlayerHandler("", false, "Create", false));
                    setMultiThreadRes(player);
                }
            }
        }
    }

    let CreatePlayersSingleThread = async () => {
        let newButtonText = singleThreadPlayerHandler.buttonText === "Create"? "Cancel": "Create";
        setSingleThreadPlayerHandler(new PlayerHandler("", false, newButtonText));
        if (newButtonText === "Create") {
            //cancel
            controller.current?.abort();
            setSingleThreadPlayerHandler(new PlayerHandler("", false, newButtonText));
            setSingleThreadRes(null);
        }
        else {
            if (ValidateNumPlayers(false)) {
                //reset response
                setSingleThreadRes(null);
                controller.current = new AbortController();
                // eliminate existing error messages
                setSingleThreadPlayerHandler(new PlayerHandler("", false, newButtonText, true));
                const res = await getPlayersAsync().catch(error => console.log('err: ', error));
                if (res?.ok) {
                    let playerResponse = await res.json();
                    let player = await new Player(playerResponse.playersCreated, playerResponse.time);
                    setSingleThreadPlayerHandler(new PlayerHandler("", false, "Create", false));
                    setSingleThreadRes(player);
                }
            }
        }

    }

    return (
        <>
        <NoThreadsPlayerWrapper>
            <h4>Enter the number of players you wish to generate</h4>
            <Grid2 container spacing={2}>
                {singleThreadPlayerHandler.error && <Grid2 size={12}>
                    <Alert severity="error" onClose={
                        () =>{setSingleThreadPlayerHandler(new PlayerHandler("", false, "Create", false))}}>
                        {singleThreadPlayerHandler.errorText}</Alert>
                </Grid2>}
                <Grid2 size={6}>
                    <TextField label="Number of players" color="secondary" inputRef={numberPlayersSingleThreadRef} type="number" />
                </Grid2>
                <Grid2 size={6}>
                    <Button variant="outlined" onClick={CreatePlayersSingleThread}>{singleThreadPlayerHandler.buttonText}</Button>
                </Grid2>
            </Grid2>
            {singleThreadPlayerHandler.isWaiting && <Grid2 size={12}>
                <TopMargin>
                    <LinearProgress />
                </TopMargin>
            </Grid2>}
            {singleThreadRes && <ResponseContainer>
                <div style={{width: 50 + "%",  border: 1 + "px " + "solid " + "#e0dcdc"}}>
                <h3>Response Details</h3>
                <h4>Time: {singleThreadRes.time} ms</h4>
                <h4>Players Created: {singleThreadRes.playersCreated}</h4>
                </div>
            </ResponseContainer>}
        </NoThreadsPlayerWrapper>


    <PlayersWithThreadsWrapper>
        <h4>Now enter the number of threads to use to generate each player</h4>
        <Grid2 container spacing={2}>
            {threadedPlayerHandler.error && <Grid2 size={12}>
                <Alert severity="error" onClose={
                    () =>{setThreadedPlayerHandler(new PlayerHandler("", false, "Create", false))}}>
                    {threadedPlayerHandler.errorText}</Alert>
            </Grid2>}
            <Grid2 size={4}>
                <TextField label="Number of players" color="secondary" inputRef={numberPlayersThreadedRef} type="number" />
            </Grid2>
            <Grid2 size={4}>
                <TextField label="Threads" color="secondary" inputRef={numberThreadsRef} type="number" />
            </Grid2>
            <Grid2 size={4}>
                <Button variant="outlined" onClick={CreatePlayersMultipleThreads}>{threadedPlayerHandler.buttonText}</Button>
            </Grid2>
        </Grid2>
        {threadedPlayerHandler.isWaiting && <Grid2 size={12}>
            <TopMargin>
                <LinearProgress />
            </TopMargin>
        </Grid2>}
        {multiThreadRes && <ResponseContainer>
            <div style={{width: 50 + "%",  border: 1 + "px " + "solid " + "#e0dcdc"}}>
                <h3>Response Details</h3>
                <h4>Time: {multiThreadRes.time} ms</h4>
                <h4>Players Created: {multiThreadRes.playersCreated}</h4>
            </div>
        </ResponseContainer>}
    </PlayersWithThreadsWrapper>
        </>
        );
}

ThreadsPlayers.propTypes = {};

export default ThreadsPlayers;
