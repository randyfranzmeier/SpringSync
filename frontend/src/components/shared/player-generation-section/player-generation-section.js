import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Grid2, LinearProgress, TextField, Divider } from "@mui/material";
import { PLAYER } from "../../../constants/Players";
import { API_URLS } from "../../../constants/endpoints";
import { Player, PlayerHandler, ThreadedPlayerRequest } from "../../../models/Player";
import { InstructionHeader, ResponseContainer, TopMargin } from "../component-styles";
import { THREAD } from "../../../constants/Threads";
import { BUTTON_TEXT } from '../../../constants/Counter';
import { validateNumericInputs } from '../../../services/validation';

function PlayerGenerationSection({ useThreads = false }) {
   let controller = useRef(null);
   let numberThreadsRef = useRef(0);
   let numberPlayersRef = useRef(0);
   const [playerHandler, setPlayerHandler] = useState(new PlayerHandler("", false, BUTTON_TEXT.CREATE, false));
   const [response, setResponse] = useState(null);

   let validateInputs = () => {
      let valid = true;
        // validate number of players
        if (!validateNumericInputs(numberPlayersRef.current.value, 1, PLAYER.CREATE_LIMIT)) {
          valid = false;
          setPlayerHandler(new PlayerHandler(`You must enter a number between 1 and ${PLAYER.CREATE_LIMIT}, inclusive`, true, BUTTON_TEXT.CREATE, false));
        }
        // validate threads if used
        if (useThreads) {
          if (!validateNumericInputs(numberThreadsRef.current.value, 1, THREAD.LIMIT)) {
            // We don't want multiple error messages, just simplifying it with a generic one for them both.
            let errMsg = !valid ? "Invalid Inputs, please enter a number and in the correct range" : `You must enter a number between 1 and ${THREAD.LIMIT}, inclusive`;
            valid = false;
            setPlayerHandler(new PlayerHandler(errMsg, true, BUTTON_TEXT.CREATE, false));
          }
        }
  
        return valid;
     }


   let fetchPlayersAsync = async () => {
      if (useThreads) {
         const body = new ThreadedPlayerRequest(Number(numberThreadsRef.current.value), Number(numberPlayersRef.current.value));
         return await fetch(API_URLS.CreatePlayersWithThreads, {
            method: "POST",
            signal: controller.current.signal,
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
         });
      }
      else {
         return await fetch(`${API_URLS.CreatePlayerNoThreads}${numberPlayersRef.current.value}`, {
            method: "GET",
            signal: controller.current.signal,
            mode: "cors",
            headers: { "Content-Type": "application/json" }
         })
      }
   }

   let createPlayers = async () => {
      let newButtonText = playerHandler.buttonText === BUTTON_TEXT.CREATE ? BUTTON_TEXT.CANCEL : BUTTON_TEXT.CREATE;
      setPlayerHandler(new PlayerHandler("", false, newButtonText, false));

      if (newButtonText === BUTTON_TEXT.CREATE) {
         // Cancel request
         controller.current?.abort();
         setPlayerHandler(new PlayerHandler("", false, newButtonText, false));
         setResponse(null);
      }
      else {
         // Reset response
         setResponse(null);

         if (validateInputs()) {
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

   return (
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
         <div>
            <h3>Response Details</h3>
            <h4>Time: {response.time} ms</h4>
            <h4>Players Created: {response.playersCreated}</h4>
         </div>
      </ResponseContainer>}
   </>);
}

export default PlayerGenerationSection;
