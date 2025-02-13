import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/Login";
import Profile from "./components/Profile";
import { ThemeProvider } from "@mui/material/styles";
import quantumTheme from './theme';

function App() {
    return (
        <ThemeProvider theme={quantumTheme}>
            <Router>
                <Routes>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;