import React, { useEffect, useRef, useState } from 'react';
import { NoThreadsPlayerWrapper, PlayersWithThreadsWrapper } from './compare-players.styled';
import { Alert, Button, Grid2, LinearProgress, TextField, Divider } from "@mui/material";
import { PLAYER } from "../../constants/Players";
import { API_URLS } from "../../constants/endpoints";
import { Player, PlayerHandler, ThreadedPlayerRequest } from "../../models/Player";
import { InstructionHeader, ResponseContainer, TopMargin } from "../shared/component-styles";
import { THREAD } from "../../constants/Threads";
import { BUTTON_TEXT } from '../../constants/Counter';

function PlayerGenerationSection({ useThreads }) {
   let controller = useRef(null);
   let numberThreadsRef = useRef(0);
   let numberPlayersRef = useRef(0);
   const [playerHandler, setPlayerHandler] = useState(new PlayerHandler("", false, BUTTON_TEXT.CREATE, false));
   const [response, setResponse] = useState(null);


   let validateNumThreads = () => {
      if (numberThreadsRef.current.value.length === 0) {
         setPlayerHandler(new PlayerHandler("Please enter the number of threads", true, BUTTON_TEXT.CREATE, false));
         return false;
      }
      else if (numberThreadsRef.current.value <= 0) {
         setPlayerHandler(new PlayerHandler("You must have at least 1 thread", true, BUTTON_TEXT.CREATE, false));
         return false;
      }
      else if (numberThreadsRef.current.value > THREAD.LIMIT) {
         setPlayerHandler(new PlayerHandler(`You must enter a number less than or equal to ${THREAD.LIMIT}`, true, BUTTON_TEXT.CREATE, false));
         return false;
      }
      return true;
   }

   let validateInputs = () => {
      // validate number of players
      if (numberPlayersRef.current.value.length === 0) {
         const errorText = "Please enter the number of players";
         const playerHandler = new PlayerHandler(errorText, true, BUTTON_TEXT.CREATE, false);
         useThreads ? setPlayerHandler(playerHandler) : setSingleThreadPlayerHandler(playerHandler);
         return false;
      }
      else if (numberPlayersRef.current.value <= 0) {
         const errorText = "You must create at least 1 player";
         const playerHandler = new PlayerHandler(errorText, true, BUTTON_TEXT.CREATE, false);
         useThreads ? setPlayerHandler(playerHandler) : setSingleThreadPlayerHandler(playerHandler);
         return false;
      }
      else if (numberPlayersRef.current.value > PLAYER.CREATE_LIMIT) {
         const errorText = `You must enter a number less than or equal to ${PLAYER.CREATE_LIMIT}`;
         const playerHandler = new PlayerHandler(errorText, true, BUTTON_TEXT.CREATE, false);
         useThreads ? setPlayerHandler(playerHandler) : setSingleThreadPlayerHandler(playerHandler);
         return false;
      }

      // validate threads if used
      return useThreads ? validateNumThreads() : true;
   }


   let fetchPlayersAsync = async () => {
      if (useThreads) {
         const body = new ThreadedPlayerRequest(Number(numberThreadsRef.current.value), Number(numberPlayersThreadedRef.current.value));
         return fetch(API_URLS.CreatePlayersWithThreads, {
            method: "POST",
            signal: controller.current.signal,
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
         });
      }
      else {
         return fetch(`${API_URLS.CreatePlayerNoThreads}${numberPlayersSingleThreadRef.current.value}`, {
            method: "GET",
            signal: controller.current.signal,
            mode: "cors",
            headers: { "Content-Type": "application/json" }
         })
      }
   }

   let createPlayers = async () => {
      let newButtonText = threadedPlayerHandler.buttonText === BUTTON_TEXT.CREATE ? BUTTON_TEXT.CANCEL : BUTTON_TEXT.CREATE;
      setPlayerHandler(new PlayerHandler("", false, newButtonText, false));

      if (newButtonText === BUTTON_TEXT.CREATE) {
         // Cancel request
         controller.current?.abort();
         setPlayerHandler(new PlayerHandler("", false, newButtonText, false));
         setResponse(null);
      }
      else {
         if (validateInputs()) {
            // Reset response
            setResponse(null);
            controller.current = new AbortController();

            // eliminate existing error messages
            setPlayerHandler(new PlayerHandler("", false, newButtonText, true));

            // Fetch API and display the results
            const res = await fetchPlayersAsync().catch(error => console.log('err: ', error));
            if (res?.ok) {
               let playerResponse = await res.json();
               let player = new Player(playerResponse.playersCreated, playerResponse.time);
               setPlayerHandler(new PlayerHandler("", false, BUTTON_TEXT.CREATE, false));
               setResponse(player);
            }
         }
      }
   }

   <>
      <InstructionHeader>
         {useThreads && <h4>Now enter the number of threads to use to generate each player</h4>}
         {!useThreads && <h4>Enter the number of players you wish to generate</h4>}
      </InstructionHeader>
      <Grid2 container spacing={2}>
         {playerHandler.error && <Grid2 size={12}>
            <Alert severity="error" onClose={
               () => { setPlayerHandler(new PlayerHandler("", false, BUTTON_TEXT.CREATE, false)) }}>
               {playerHandler.errorText}</Alert>
         </Grid2>}
         <Grid2 size={useThreads ? 4 : 6}>
            <TextField label="Number of players" color="secondary" inputRef={numberPlayersRef} type="number" />
         </Grid2>
         {useThreads && <Grid2 size={4}>
            <TextField label="Threads" color="secondary" inputRef={numberThreadsRef} type="number" />
         </Grid2>}
         <Grid2 size={useThreads ? 4 : 6}>
            <Button variant="outlined" onClick={createPlayers}>{playerHandler.buttonText}</Button>
         </Grid2>
      </Grid2>
      {playerHandler.isWaiting && <Grid2 size={12}>
         <TopMargin>
            <LinearProgress />
         </TopMargin>
      </Grid2>}
      {response && <ResponseContainer>
         <div style={{ width: 50 + "%", border: 1 + "px " + "solid " + "#e0dcdc" }}>
            <h3>Response Details</h3>
            <h4>Time: {response.time} ms</h4>
            <h4>Players Created: {response.playersCreated}</h4>
         </div>
      </ResponseContainer>}
   </>
}

export default PlayerGenerationSection;
