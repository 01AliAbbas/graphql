import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Profile from "./components/Profile";
import { ThemeProvider } from "@mui/material/styles";
import quantumTheme from './theme';

function App() {
    return (
        <ThemeProvider theme={quantumTheme}>
            <Router basename="/graphql">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* Add catch-all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;