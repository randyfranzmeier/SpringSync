import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {NoThreadsPlayerWrapper} from './create-players-no-threads.styled';
import {Alert, Button, Grid2, LinearProgress, TextField} from "@mui/material";
import {PLAYER} from "../../constants/Players";
import {API_URLS} from "../../constants/endpoints";
import {Player} from "../../models/Player";
import {ResponseContainer, TopMargin} from "../shared/component-styles";


function NoThreadsPlayers () {
    let controller = useRef(null);
    let numberPlayersRef = useRef(0);
    const [errorText, setErrorText] = useState("");
    const [error, setError] = useState(false);
    const [response, setResponse] = useState(null)
    const [isWaiting, setIsWaiting] = useState(false);
    const [buttonText, setButtonText] = useState("Create")


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
        const fullUrl = API_URLS.CreatePlayerNoThreads + `${numberPlayersRef.current.value}`;

        return fetch(fullUrl, {
            method: "GET",
            signal: controller.current.signal,
            mode: "cors",
            headers: { "Content-Type": "application/json" }
        })
    }

    let CreatePlayers = async () => {
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
        <NoThreadsPlayerWrapper>
            <h4>Enter the number of players you wish to generate</h4>
            <Grid2 container spacing={2}>
                {error && <Grid2 size={12}>
                    <Alert severity="error" onClose={() =>{setError(false)}}>{errorText}</Alert>
                </Grid2>}
                <Grid2 size={6}>
                    <TextField label="Number of players" color="secondary" inputRef={numberPlayersRef} type="number" />
                </Grid2>
                <Grid2 size={6}>
                    <Button variant="outlined" onClick={CreatePlayers}>{buttonText}</Button>
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


        </NoThreadsPlayerWrapper>
        )
}

NoThreadsPlayers.propTypes = {};

export default NoThreadsPlayers;
