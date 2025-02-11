import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Box,
    Container,
    Typography,
    IconButton,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import * as data from "./data";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [recentAudits, setAudits] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const users = await data.fetchUsers();
                setUser(users[0]);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchRecentAudits = async () => {
            try {
                const audits = await data.fetchRecentAudits();
                setAudits(audits);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentAudits();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "radial-gradient(circle, #1a1a2e, #16213e)",
                p: 3,
                overflow: "hidden",
            }}
        >
            <Container maxWidth="md" sx={{ position: "relative", textAlign: "center" }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h4"
                        sx={{ color: "#0ff", fontWeight: "bold", textShadow: "0px 0px 10px #0ff" }}
                    >
                        Quantum Flux Dashboard
                    </Typography>
                </motion.div>

                <IconButton
                    onClick={handleLogout}
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        m: 2,
                        color: "#0ff",
                        backgroundColor: "rgba(0, 255, 255, 0.2)",
                        "&:hover": { backgroundColor: "rgba(0, 255, 255, 0.4)" },
                    }}
                >
                    <LogoutIcon />
                </IconButton>

                <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={4}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2, boxShadow: "0px 0px 20px #0ff" }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: "#0ff" }}>User Details</Typography>
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <>
                                            <Typography>Name: {user?.firstName} {user?.lastName}</Typography>
                                            <Typography>Email: {user?.email}</Typography>
                                            <Typography>Joined At: {new Date(user?.createdAt).toLocaleDateString()}</Typography>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2, boxShadow: "0px 0px 20px #0ff" }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: "#0ff" }}>Recent Audits</Typography>
                                    <TableContainer component={Paper} sx={{ background: "transparent" }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: "#0ff" }}>Project Name</TableCell>
                                                    <TableCell sx={{ color: "#0ff" }}>Captain</TableCell>
                                                    <TableCell sx={{ color: "#0ff" }}>Date</TableCell>
                                                    <TableCell sx={{ color: "#0ff" }}>Result</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {loading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center">
                                                            <CircularProgress size={24} />
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    recentAudits?.audits?.map((audit, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{ color: "#0ff" }}>{audit.group.object.name}</TableCell>
                                                            <TableCell sx={{ color: "#0ff" }}>{audit.group.captainLogin}</TableCell>
                                                            <TableCell sx={{ color: "#0ff" }}>{new Date(audit.closedAt).toLocaleDateString()}</TableCell>
                                                            <TableCell sx={{ color: "#0ff" }}>{audit.closureType}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Profile;
