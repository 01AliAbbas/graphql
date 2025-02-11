import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Profile from "./components/Profile";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import quantumTheme from './theme';

function App() {
    return (
        <ThemeProvider theme={quantumTheme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;