import React, { useState, useCallback } from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import quantumTheme from "../theme";
import { loadFull } from "tsparticles";
import { Particles } from "react-tsparticles";

const ParticlesComponent = () => {
    const particlesInit = useCallback(async (engine) => {
      await loadFull(engine);
    }, []);
  
    return (
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 40, density: { enable: true, area: 800 } },
            color: { value: "#0ff" },
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: 3, random: true },
            links: {
              enable: true,
              distance: 150,
              color: "#0ff",
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: "none",
              random: false,
              straight: false,
              outModes: "out",
              bounce: false,
            }
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" }
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 4 }
            }
          },
          detectRetina: true
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0
        }}
      />
    );
  };

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
                background: "radial-gradient(circle, #1a1a2e, #16213e)",
                p: 3,
                overflow: "hidden",
                position: "relative",
            }}
        >
            <ParticlesComponent />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                }}
            >
                <Container maxWidth="xs">
                    <Box
                        component={motion.div}
                        initial={{ boxShadow: "0 0 20px #0ff33" }}
                        animate={{ 
                            boxShadow: ["0 0 20px #0ff33", "0 0 30px #bc13fe66", "0 0 20px #0ff33"]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 0 40px #0ff"
                        }}
                        sx={{
                            background: "rgba(0, 255, 255, 0.1)",
                            borderRadius: "16px",
                            p: 4,
                            border: "1px solid rgba(0, 255, 255, 0.3)",
                            position: "relative",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Typography
                            component={motion.div}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            variant="h4"
                            sx={{
                                textAlign: "center",
                                color: "#0ff",
                                fontWeight: "bold",
                                mb: 3,
                                textShadow: "0px 0px 10px #0ff",
                                fontFamily: quantumTheme.typography.fontFamily,
                            }}
                        >
                            Quantum GraphQL
                        </Typography>
                        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
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
                                    sx={{
                                        "& label": { color: "#0ff" },
                                        "& input": { color: "white" },
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { 
                                                borderColor: "#0ff",
                                                transition: "all 0.3s ease"
                                            },
                                            "&:hover fieldset": { 
                                                borderColor: "#bc13fe",
                                                boxShadow: "0 0 15px #bc13fe"
                                            },
                                            "&.Mui-focused fieldset": { 
                                                borderColor: "#bc13fe",
                                                boxShadow: "0 0 15px #bc13fe"
                                            },
                                        },
                                    }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
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
                                    sx={{
                                        "& label": { color: "#0ff" },
                                        "& input": { color: "white" },
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { 
                                                borderColor: "#0ff",
                                                transition: "all 0.3s ease"
                                            },
                                            "&:hover fieldset": { 
                                                borderColor: "#bc13fe",
                                                boxShadow: "0 0 15px #bc13fe"
                                            },
                                            "&.Mui-focused fieldset": { 
                                                borderColor: "#bc13fe",
                                                boxShadow: "0 0 15px #bc13fe"
                                            },
                                        },
                                    }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Button
                                    component={motion.button}
                                    whileHover={{ 
                                        scale: 1.05,
                                        background: "linear-gradient(45deg, #bc13fe 40%, #0ff 100%)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        background: "linear-gradient(45deg, #bc13fe 30%, #0ff 90%)",
                                        color: "#1a1a2e",
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            boxShadow: "0 0 25px #bc13fe",
                                        },
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Initiate Sequence"}
                                </Button>
                            </motion.div>

                            {errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <Alert
                                        severity="error"
                                        sx={{
                                            mt: 2,
                                            bgcolor: "rgba(255, 0, 0, 0.2)",
                                            color: "#ff4444",
                                            border: "1px solid #ff4444",
                                            backdropFilter: "blur(5px)",
                                        }}
                                    >
                                        {errorMessage}
                                    </Alert>
                                </motion.div>
                            )}
                        </Box>
                    </Box>
                </Container>
            </motion.div>
        </Box>
    );
}

export default Login;