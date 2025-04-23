import React, {useRef, useState} from 'react';
import { CounterTimerWrapper } from './counter-timer.styled';
import {Alert, Button, Grid2, LinearProgress, TextField} from "@mui/material";
import {InstructionHeader, ResponseContainer, TopMargin} from "../shared/component-styles";
import {BUTTON_TEXT, COUNTER} from "../../constants/Counter"
import {THREAD} from "../../constants/Threads";
import {API_URLS} from "../../constants/endpoints";
import {CounterRequest, CounterResponse} from "../../models/Counter";

function CounterTimer () {
    let controller = useRef(null);
    let numThreadsRef = useRef(0);
    let counterRef = useRef(0);
    const [response, setResponse] = useState(null);
    const [isWaiting, setIsWaiting] = useState(false);
    const [counterError, setCounterError] = useState(false);
    const [counterErrorText, setCounterErrorText] = useState("");
    const [numThreadsError, setNumThreadsError] = useState(false);
    const [numThreadsErrorText, setNumThreadsErrorText] = useState("");
    const [buttonText, setButtonText] = useState("Create");


    let getCounterAsync = async () => {
        const body = new CounterRequest(Number(numThreadsRef.current.value), Number(counterRef.current.value));

        return fetch(API_URLS.CounterTimer, {
            method: "POST",
            signal: controller.current.signal,
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    }

    let handleCounter = async () => {
        let newButtonText = buttonText === BUTTON_TEXT.CREATE? BUTTON_TEXT.CANCEL: BUTTON_TEXT.CREATE;
        // Change button text on click
        setButtonText(newButtonText);
        
        if (newButtonText === BUTTON_TEXT.CREATE) {
            //cancel API call
            controller.current?.abort();
            setIsWaiting(false);
            setResponse(null);
        }
        else {
            if (!numThreadsError && !counterError) {
                // reset response
                setResponse(null);
                // initialize controller for current API call
                controller.current = new AbortController();
                // call API
                const res = await getCounterAsync().catch(error => console.log('err: ', error));
                if (res?.ok) {
                    let counterResponse = await res.json();
                    let counter = new CounterResponse(counterResponse.timeToComplete, counterResponse.endValue);
                    setButtonText(BUTTON_TEXT.CREATE);
                    setIsWaiting(false);
                    setResponse(counter);
                }
            }
        }
    }

    let handleCounterChange = (event) => {
        if (!event.target.value) {
            setCounterError(true)
            setCounterErrorText("Counter must have a value");
        }
        else if (event.target.value > COUNTER.MAX_NUMBER) {
            setCounterError(true)
            setCounterErrorText(`Counter cannot exceed ${COUNTER.MAX_NUMBER}`)
        }
        else if (event.target.value < 1) {
            setCounterError(true)
            setCounterErrorText(`Counter must be greater than 0`)
        }
        else {
            setCounterError(false)
        }

    }

    let handleThreadChange = (event) => {
        if (!event.target.value) {
            setNumThreadsError(true);
            setNumThreadsErrorText("Threads must have a value");
        }
        else if (event.target.value > THREAD.LIMIT) {
            setNumThreadsError(true);
            setNumThreadsErrorText(`Cannot exceed ${THREAD.LIMIT} threads`)
        }
        else if (event.target.value < 1) {
            setNumThreadsError(true);
            setNumThreadsErrorText(`Threads must be greater than 0`)
        }
        else {
            setNumThreadsError(false);
        }
    }


return (
    <CounterTimerWrapper>
        <InstructionHeader>
            <h4>Enter the number to count to and the threads used to count to that number</h4>
        </InstructionHeader>
        <Grid2 container spacing={2}>
            {numThreadsError && <Grid2 size={12}>
                <Alert severity="error">
                    {numThreadsErrorText}
                </Alert>
            </Grid2>}
            {counterError && <Grid2 size={12}>
                <Alert severity="error">
                    {counterErrorText}
                </Alert>
            </Grid2>}
            <Grid2 size={4}>
                <TextField label="Counter" color="secondary" inputRef={counterRef} type="number" onChange={handleCounterChange} />
            </Grid2>
            <Grid2 size={4}>
                <TextField label="Number of Threads" color="secondary" inputRef={numThreadsRef}
                           type="number" onChange={handleThreadChange}/>
            </Grid2>
            <Grid2 size={4}>
                <Button variant="outlined"
                        onClick={handleCounter}>{buttonText}</Button>
            </Grid2>
        </Grid2>
        {isWaiting && <Grid2 size={12}>
            <TopMargin>
                <LinearProgress/>
            </TopMargin>
        </Grid2>}
        {response && <ResponseContainer>
            <div style={{width: 50 + "%", border: 1 + "px " + "solid " + "#e0dcdc"}}>
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
