import React from 'react';
import { NoThreadsPlayerWrapper, PlayersWithThreadsWrapper } from './compare-players.styled';
import { Alert, Button, Divider, Grid2, LinearProgress, TextField } from "@mui/material";
import { BUTTON_TEXT } from '../../constants/Counter';
import PlayerGenerationSection from '../shared/player-generation-section/player-generation-section';

// TODO put question mark icon so users can learn more about what the API does
let ComparePlayers = () => (
    <>
        <NoThreadsPlayerWrapper>
            <PlayerGenerationSection
            />
        </NoThreadsPlayerWrapper>

        <PlayersWithThreadsWrapper>
            <PlayerGenerationSection
                useThreads={true}
            />
        </PlayersWithThreadsWrapper>
    </>
);

export default ComparePlayers;
