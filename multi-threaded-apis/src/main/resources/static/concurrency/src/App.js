import './App.css';
import Nav from "./components/nav/nav";
import {Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Divider, Typography} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import ThreadsPlayers from "./components/create-players-no-threads/create-players-no-threads";
import CounterTimer from "./components/counter-timer/counter-timer";


function App() {
    const ThreadsPlayerCard = (
        <>
            <CardContent>
                <h3>Create players with only one thread</h3>
                <ThreadsPlayers/>
            </CardContent>
        </>
    );


    const counterTimerCard = (
        <>
            <CardContent>
                <h3>Increment counter with specified limit and threads with no time delay</h3>
                <CounterTimer></CounterTimer>
            </CardContent>
        </>
    );

    return (
        <div className="App">
            <Nav/>
            <div className="simulation-container">
                <h1>Select one of the below options to explore and learn about multithreading</h1>

                <Divider className="divider"/>

                <div className="card-container">
                    <Card variant="outlined">{ThreadsPlayerCard}</Card>
                </div>

                <Divider className="divider"/>

                <div className="card-container">
                    <Card variant="outlined">{counterTimerCard}</Card>
                </div>
            </div>
        </div>
    );
}

export default App;
