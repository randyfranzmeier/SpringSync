import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {NoThreadsPlayerWrapper, ResponseContainer} from './create-players-no-threads.styled';
import {Alert, Button, Grid2, TextField} from "@mui/material";
import {PLAYER} from "../../constants/Players";
import {API_URLS} from "../../constants/endpoints";
import {Player} from "../../models/Player";


function NoThreadsPlayers () {
    let numberPlayersRef = useRef(0);
    const [errorText, setErrorText] = useState("");
    const [error, setError] = useState(false);
    const [response, setResponse] = useState(null)


    let ValidateNumPlayers = () => {
        if (numberPlayersRef.current.value.length === 0) {
            setError(true);
            setErrorText("Please enter the number of players");
            return false;
        }
        else if (numberPlayersRef.current.value <= 0) {
            setError(true);
            setErrorText("You must create at least 1 player");
            return false;
        }
        else if (numberPlayersRef.current.value > PLAYER.CREATE_LIMIT) {
            setError(true);
            setErrorText(`You must enter a number less than or equal to ${PLAYER.CREATE_LIMIT}`);
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
            mode: "cors",
            headers: { "Content-Type": "application/json" }
        })
    }

    let CreatePlayers = async () => {
        if (ValidateNumPlayers()) {
            // eliminate existing error messages
            setError(false);
            const res = await getPlayersAsync().catch(error => console.log('err: ', error));
            if (res.ok) {
                let playerResponse = await res.json();
                let player = await new Player(playerResponse.playersCreated, playerResponse.time);
                setResponse(player)
            }
        }

    }

    return (
        <NoThreadsPlayerWrapper>
            <h4>Create a certain amount of randomly-generated sports players and see how long it takes to complete</h4>
            <Grid2 container spacing={2}>
                {error && <Grid2 size={12}>
                    <Alert severity="error" onClose={() =>{setError(false)}}>{errorText}</Alert>
                </Grid2>}
                <Grid2 size={6}>
                    <TextField label="Number of players" color="secondary" inputRef={numberPlayersRef} type="number" />
                </Grid2>
                <Grid2 size={6}>
                    <Button variant="outlined" onClick={CreatePlayers}>Create</Button>
                </Grid2>
            </Grid2>
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

NoThreadsPlayers.defaultProps = {};

export default NoThreadsPlayers;
