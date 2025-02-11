// Here are the contents for the file: /my-react-app/my-react-app/src/components/Login.tsx

import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        try {
            const credentials = btoa(`${username}:${password}`);
            const response = await fetch("https://learn.reboot01.com/api/auth/signin", {
                method: "POST",
                headers: { Authorization: `Basic ${credentials}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }

            const data = await response.json();
            localStorage.setItem("token", data);
            navigate("/profile");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                padding: "20px",
            }}
        >
            <Container maxWidth="xs">
                <Box
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "16px",
                        padding: "32px",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            textAlign: "center",
                            color: "#6a11cb",
                            fontWeight: "bold",
                            mb: 3,
                        }}
                    >
                        Welcome Back!
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                                color: "#fff",
                                fontWeight: "bold",
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Login"}
                        </Button>
                        {errorMessage && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {errorMessage}
                            </Alert>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Login;