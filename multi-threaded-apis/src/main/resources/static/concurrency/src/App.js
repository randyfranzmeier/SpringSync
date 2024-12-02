import './App.css';
import Nav from "./components/nav/nav";
import {Accordion, AccordionDetails, AccordionSummary, Divider, Typography} from "@mui/material";
import ThreadedPlayers from "./components/create-players-with-threads/create-players-with-threads";
import {ExpandMore} from "@mui/icons-material";
import NoThreadsPlayers from "./components/create-players-no-threads/create-players-no-threads";
import CounterTimer from "./components/counter-timer/counter-timer";


function App() {
    return (
        <div className="App">
            <Nav/>
            <div className="simulation-container">
                <h1>Select one of the below options to explore and learn about multithreading</h1>
                <Divider className="divider"/>
                <div className="accordion-container">
                    <Accordion slotProps={{heading: {component: 'h4'}}}>
                        <AccordionSummary
                            expandIcon={<ExpandMore/>}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography>Create players with only one thread </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <NoThreadsPlayers/>
                        </AccordionDetails>
                    </Accordion>
                </div>

                <Divider className="divider"/>
                <div className="accordion-container">
                    <Accordion slotProps={{heading: {component: 'h4'}}}>
                        <AccordionSummary
                            expandIcon={<ExpandMore/>}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography>Create Players with up to 20 threads at a time</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ThreadedPlayers/>
                        </AccordionDetails>
                    </Accordion>
                </div>

                <Divider className="divider"/>
                <div className="accordion-container">
                    <Accordion slotProps={{heading: {component: 'h4'}}}>
                        <AccordionSummary
                            expandIcon={<ExpandMore/>}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography>Increment counter with specified limit and threads</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <CounterTimer/>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}

export default App;
