import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Profile from "./components/Profile";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#0ff",
        },
        secondary: {
            main: "#f0f",
        },
        background: {
            paper: "#1a1a1a",
        },
    },
});
function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/profile" element={<ThemeProvider theme={theme}>
                    <Profile />
                </ThemeProvider>} />

            </Routes>
        </Router>
    );
}

export default App;