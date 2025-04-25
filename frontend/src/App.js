import './App.css';
import Nav from "./components/nav/nav";
import { Card, CardContent, Grid2 } from "@mui/material";
import CounterTimer from "./components/counter-timer/counter-timer";
import ComparePlayers from './components/compare-players/compare-players';


function App() {
    const ComparePlayersCard = (
        <>
            <CardContent>
                <h3>Create players with only one thread</h3>
                <ComparePlayers/>
            </CardContent>
        </>
    );


    const CounterTimerCard = (
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

                {/*<Divider className="divider"/>*/}
                <Grid2 container spacing={2}>
                    <Grid2 size={6}>
                        <div className="card-container">
                            <Card variant="outlined">{ComparePlayersCard}</Card>
                        </div>
                    </Grid2>

                    <Grid2 size={6}>
                        <div className="card-container">
                            <Card variant="outlined">{CounterTimerCard}</Card>
                        </div>
                    </Grid2>
                    {/*<Divider className="divider"/>*/}
                </Grid2>
            </div>
        </div>
    );
}

export default App;
