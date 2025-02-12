import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
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
    const [transactions, setXpOverTime] = useState([]);
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
                console.error("Failed to fetch recent audits:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentAudits();
    }, []);

    useEffect(() => {
        const fetchXpData = async () => {
            try {
                const xpData = await data.fetchXpOverTime();
                const formattedData = xpData.map(tx => ({
                    date: new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                    xp: tx.amount / (1024) //KB
                }));
                setXpOverTime(formattedData);
            } catch (error) {
                console.error("Failed to fetch XP over time:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchXpData();
    }, []);
    useEffect(() => {
        const fetchXpData = async () => {
            try {
                const skillsData = await data.fetchSkills();

                // Aggregate skills by month
                const monthlyData = skillsData.reduce((acc, skill) => {
                    const date = new Date(skill.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric"
                    });

                    const existing = acc.find(entry => entry.date === date);
                    if (existing) {
                        existing.xp += skill.amount / 1024; // Maintain KB conversion
                    } else {
                        acc.push({
                            date,
                            xp: skill.amount / 1024
                        });
                    }
                    return acc;
                }, []);

                // Sort data chronologically
                monthlyData.sort((a, b) => new Date(a.date) - new Date(b.date));

                setXpOverTime(monthlyData);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchXpData();
    }, []);
    // Get the skills
    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                const skillsData = await data.fetchSkills();
                
                // Aggregate skills by type
                const skillData = skillsData.reduce((acc, skill) => {
                    const existing = acc.find(entry => entry.type === skill.type);
                    if (existing) {
                        existing.xp += skill.amount / 1024; // Maintain KB conversion
                    } else {
                        acc.push({
                            type: skill.type,
                            xp: skill.amount / 1024
                        });
                    }
                    return acc;
                }, []);
                
                setXpOverTime(skillData);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSkillsData();
    }, []);
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };



    return (
        <Box
            sx={{
                minHeight: "50vh",
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
                    <Grid item xs={12} md={6}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2, boxShadow: "0px 0px 20px #0ff", height: '100%' }}>
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
                    <Grid item xs={12} md={6}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2, boxShadow: "0px 0px 20px #0ff", height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, color: "#0ff" }}>Audit Ratio</Typography>
                                    <Typography>your audit ratio is {user?.auditRatio.toFixed(1)}</Typography>
                                    <Typography>Done {Math.round((user?.totalUp / (1024 * 1024)) * 100) / 100} MB</Typography>
                                    <Typography>Received {Math.round((user?.totalDown / (1024 * 1024)) * 100) / 100} MB</Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2, boxShadow: "0px 0px 20px #0ff" }}>
                                <CardContent>
                                    <Box sx={{ minHeight: "50vh", background: "#1a1a2e", p: 3 }}>
                                        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
                                            <Typography variant="h4" sx={{ color: "#0ff", fontWeight: "bold" }}>
                                                XP Over Time
                                            </Typography>
                                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                                <Grid item xs={12}>
                                                    <motion.div whileHover={{ scale: 1.05 }}>
                                                        <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2 }}>
                                                            <CardContent>
                                                                {loading ? (
                                                                    <CircularProgress size={24} />
                                                                ) : (
                                                                    <ResponsiveContainer width="100%" height={400}>
                                                                        <LineChart data={transactions}>
                                                                            <XAxis dataKey="date" stroke="white" interval={15} angle={-45} textAnchor="end" height={100} />
                                                                            <YAxis stroke="#0ff" tickCount={1} label={{ value: "XP (KB)", angle: -90, position: "insideLeft" }} domain={['auto', 'auto']} />
                                                                            <Tooltip contentStyle={{ backgroundColor: "#16213e", color: "white" }} />
                                                                            <Line type="monotone" dataKey="xp" stroke="#0ff" strokeWidth={2} dot={{ r: 1 }} />
                                                                        </LineChart>
                                                                    </ResponsiveContainer>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                </Grid>
                                            </Grid>
                                        </Container>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                    <Grid item xs={12}>
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
                                                            <TableCell sx={{ color: "white" }}>{audit.group.object.name}</TableCell>
                                                            <TableCell sx={{ color: "white" }}>{audit.group.captainLogin}</TableCell>
                                                            <TableCell sx={{ color: "white" }}>{new Date(audit.closedAt).toLocaleDateString()}</TableCell>
                                                            <TableCell sx={{ color: "white" }}>{audit.closureType}</TableCell>
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
