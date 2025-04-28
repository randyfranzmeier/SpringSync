import React, { useRef, useState } from 'react';
import { CounterTimerWrapper } from './counter-timer.styled';
import { Alert, Button, Grid2, LinearProgress, TextField } from "@mui/material";
import { InstructionHeader, ResponseContainer, TopMargin } from "../shared/component-styles";
import { BUTTON_TEXT, COUNTER } from "../../constants/Counter"
import { THREAD } from "../../constants/Threads";
import { API_URLS } from "../../constants/endpoints";
import { CounterRequest, CounterResponse } from "../../models/Counter";
import { validateNumericInputs } from '../../services/validation';

function CounterTimer() {
    let controller = useRef(null);
    let numThreadsRef = useRef(null);
    let counterRef = useRef(null);
    const [response, setResponse] = useState(null);
    const [isWaiting, setIsWaiting] = useState(false);
    const [counterError, setCounterError] = useState(false);
    const [counterErrorText, setCounterErrorText] = useState("");
    const [numThreadsError, setNumThreadsError] = useState(false);
    const [numThreadsErrorText, setNumThreadsErrorText] = useState("");
    const [buttonText, setButtonText] = useState("Create");

    let resetCounterError = () => {
        setCounterError(false);
        setCounterErrorText("");
    }

    let resetThreadError = () => {
        setNumThreadsError(false);
        setNumThreadsErrorText("");
    }

    let fetchCounterAsync = async () => {
        const body = new CounterRequest(Number(numThreadsRef.current.value), Number(counterRef.current.value));

        return fetch(API_URLS.CounterTimer, {
            method: "POST",
            signal: controller.current.signal,
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    }

    let validateInputs = () => {
        let valid = true;
        // validate counter
        if (!validateNumericInputs(counterRef.current.value, 1, COUNTER.MAX_NUMBER)) {
            valid = false;
            setCounterError(true);
            setCounterErrorText(`You must enter a number between 1 and ${COUNTER.MAX_NUMBER}, inclusive`);
        }
        // validate number of threads
        if (!validateNumericInputs(numThreadsRef.current.value, 1, THREAD.LIMIT)) {
            valid = false;
            setNumThreadsError(true);
            setNumThreadsErrorText(`You must enter a number between 1 and ${THREAD.LIMIT}, inclusive`);
        }

        return valid;
    }

    let handleCounter = async () => {
        let newButtonText = buttonText === BUTTON_TEXT.CREATE ? BUTTON_TEXT.CANCEL : BUTTON_TEXT.CREATE;
        // Change button text on click
        setButtonText(newButtonText);

        if (newButtonText === BUTTON_TEXT.CREATE) {
            //cancel API call
            controller.current?.abort();
            setIsWaiting(false);
            setResponse(null);
        }
        else {
            // reset response
            setResponse(null);

            if (validateInputs()) {
                // initialize controller for current API call
                controller.current = new AbortController();
                // call API
                const res = await fetchCounterAsync().catch(error => console.log('err: ', error));
                if (res?.ok) {
                    let counterResponse = await res.json();
                    let counter = new CounterResponse(counterResponse.timeToComplete, counterResponse.endValue);
                    setIsWaiting(false);
                    setResponse(counter);
                }
            }
            setButtonText(BUTTON_TEXT.CREATE);
        }
    }


    return (
        <CounterTimerWrapper>
            <InstructionHeader>
                <h4>Enter the number to count to and the threads used to count to that number</h4>
            </InstructionHeader>
            <Grid2 container spacing={2}>
                <Grid2 size={4}>
                    <TextField onChange={resetCounterError} label="Counter" color="secondary" inputRef={counterRef} type="number" error={counterError} helperText={counterError ? counterErrorText : ""}/>
                </Grid2>
                <Grid2 size={4}>
                    <TextField onChange={resetThreadError} label="Number of Threads" color="secondary" inputRef={numThreadsRef}
                        type="number" error={numThreadsError} helperText={numThreadsError ? numThreadsErrorText : ""}/>
                </Grid2>
                <Grid2 size={4}>
                    <Button variant="outlined"
                        onClick={handleCounter}>{buttonText}</Button>
                </Grid2>
            </Grid2>
            {isWaiting && <Grid2 size={12}>
                <TopMargin>
                    <LinearProgress />
                </TopMargin>
            </Grid2>}
            {response && <ResponseContainer>
                <div>
                    <h3>Response Details</h3>
                    <h4>Time: {response.timeToComplete} ms</h4>
                    <h4>Final value of number: {response.endValue}</h4>
                </div>
            </ResponseContainer>}
        </CounterTimerWrapper>
    );
}

CounterTimer.propTypes = {};

export default CounterTimer;
