import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
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
    TableRow,
    TableHead, // Add this line
    Paper
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import * as data from "./data";
import AuditCard from "./auditCard";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesComponent = () => {
    const particlesInit = useCallback(async engine => {
        await loadFull(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: { color: { value: "transparent" } },
                particles: {
                    number: { value: 40, density: { enable: true, value_area: 800 } },
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
                        out_mode: "out",
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
                        push: { particles_nb: 4 }
                    }
                },
                retina_detect: true
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

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [recentAudits, setAudits] = useState(null);
    const [transactions, setXpOverTime] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalXP, setTotalXP] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const users = await data.fetchUsers();
                const user = users[0];
                user.totalUp = Math.round((user?.totalUp / (1000 * 1000)) * 100) / 100;
                user.totalDown = Math.round((user?.totalDown / (1000 * 1000)) * 100) / 100;
                setUser(user);
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
                const formattedData = xpData.transactions.map(tx => ({
                    date: new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
                    xp: tx.amount / 1000,
                    obj: tx.object.name
                }));

                setXpOverTime(formattedData);
                const total = Math.round(xpData.transactions_aggregate.aggregate.sum.amount / 1000);
                setTotalXP(total);
            } catch (error) {
                console.error("Failed to fetch XP over time:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchXpData();
    }, []);

    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                const skillsData = await data.fetchSkills();
                const allowedTypes = ['skill_prog', 'skill_go', 'skill_back-end', 'skill_front-end', 'skill_js', 'skill_html'];
                const skillData = skillsData.reduce((acc, { amount, type }) => {
                    const skillType = type.replace('skill_', '');
                    if (!allowedTypes.includes(type.toLowerCase())) return acc;
                    acc[skillType] = ((acc[skillType] || 0) + amount) / 1000;
                    return acc;
                }, []);
                const formattedSkills = Object.entries(skillData).map(([type, xp]) => ({ type, xp }));
                const skillOrder = ["prog", "go", "back-end", "front-end", "js", "html"];
                const sortedSkills = formattedSkills.sort((a, b) =>
                    skillOrder.indexOf(a.type) - skillOrder.indexOf(b.type)
                );
                setSkills(sortedSkills);
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
                position: "relative",
            }}
        >
            <ParticlesComponent />

            <Container sx={{ position: "relative", textAlign: "center", zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#0ff",
                            fontWeight: "bold",
                            textShadow: "0px 0px 10px #0ff",
                            fontFamily: "monospace",
                            letterSpacing: "4px"
                        }}
                    >
                        GraphQL
                    </Typography>
                </motion.div>

                <IconButton
                    component={motion.div}
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        m: 2,
                        color: "#0ff",
                        backgroundColor: "rgba(0, 255, 255, 0.2)",
                        backdropFilter: "blur(5px)",
                        "&:hover": {
                            backgroundColor: "rgba(0, 255, 255, 0.4)",
                            boxShadow: "0 0 15px #0ff"
                        },
                    }}
                >
                    <LogoutIcon />
                </IconButton>

                <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item xs={12}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card
                                component={motion.div}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0px 0px 30px #0ff"
                                }}
                                sx={{
                                    background: "rgba(0, 255, 255, 0.1)",
                                    p: 2,
                                    border: "1px solid rgba(0, 255, 255, 0.3)",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                {loading ? (
                                    <Box sx={{ p: 4, textAlign: "center" }}>
                                        <CircularProgress size={24} sx={{ color: "#0ff" }} />
                                    </Box>
                                ) : (
                                    <AuditCard user={user} />
                                )}
                            </Card>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card
                                component={motion.div}
                                whileHover={{ scale: 1.01 }}
                                sx={{
                                    background: "rgba(0, 255, 255, 0.1)",
                                    p: 2,
                                    border: "1px solid rgba(0, 255, 255, 0.3)",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ minHeight: "50vh", p: 3 }}>
                                        <Container maxWidth="59vh">
                                            <Typography
                                                variant="h4"
                                                component={motion.div}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                sx={{
                                                    color: "#0ff",
                                                    fontWeight: "bold",
                                                    textShadow: "0 0 10px #0ff"
                                                }}
                                            >
                                                Interesting Analytics
                                            </Typography>
                                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                                <Grid item xs={12} md={6}>
                                                    <motion.div
                                                        whileHover={{ scale: 1.03 }}
                                                        transition={{ type: "spring", stiffness: 200 }}
                                                    >
                                                        <Card sx={{
                                                            background: "rgba(0, 255, 255, 0.15)",
                                                            border: "1px solid #0ff",
                                                            borderRadius: "16px"
                                                        }}>
                                                            <CardContent>
                                                                {loading ? (
                                                                    <CircularProgress size={24} />
                                                                ) : (
                                                                    <ResponsiveContainer width="95%" height={300}>
                                                                        <RadarChart data={skills}>
                                                                            <PolarGrid stroke="#0ff44" />
                                                                            <PolarAngleAxis
                                                                                dataKey="type"
                                                                                tick={{
                                                                                    fill: "#0ff",
                                                                                    fontSize: 12
                                                                                }}
                                                                            />
                                                                            <Radar
                                                                                name="XP"
                                                                                dataKey="xp"
                                                                                stroke="#bc13fe"
                                                                                fill="#0ff"
                                                                                fillOpacity={0.4}
                                                                                animationDuration={400}
                                                                            />
                                                                            <Tooltip
                                                                                contentStyle={{
                                                                                    backgroundColor: "#16213e",
                                                                                    border: "1px solid #0ff",
                                                                                    borderRadius: "8px"
                                                                                }}
                                                                                formatter={(value) => [Math.round(value * 1000), 'XP']}
                                                                            />
                                                                        </RadarChart>
                                                                    </ResponsiveContainer>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <motion.div
                                                        whileHover={{ scale: 1.03 }}
                                                        transition={{ type: "spring", stiffness: 200 }}
                                                    >
                                                        <Card sx={{
                                                            background: "rgba(0, 255, 255, 0.15)",
                                                            border: "1px solid #0ff",
                                                            borderRadius: "16px"
                                                        }}>
                                                            <CardContent>
                                                                {loading ? (
                                                                    <CircularProgress size={24} />
                                                                ) : (
                                                                    <ResponsiveContainer width="95%" height={300}>
                                                                        <LineChart data={transactions}>
                                                                            <XAxis
                                                                                dataKey="date"
                                                                                stroke="#0ff"
                                                                                tick={{ fill: "#0ff", fontSize: 15 }}
                                                                                interval={20}
                                                                                angle={-20}
                                                                            />
                                                                            <YAxis
                                                                                stroke="#0ff"
                                                                                tick={{ fill: "#0ff" }}
                                                                            />
                                                                            <Tooltip
                                                                                contentStyle={{
                                                                                    backgroundColor: "#16213e",
                                                                                    border: "1px solid #0ff",
                                                                                    borderRadius: "8px"
                                                                                }}
                                                                            />
                                                                            <Line
                                                                                type="monotone"
                                                                                dataKey="xp"
                                                                                stroke="#bc13fe"
                                                                                animationDuration={400}
                                                                            />
                                                                        </LineChart>
                                                                    </ResponsiveContainer>
                                                                )}
                                                                <Typography
                                                                    component={motion.div}
                                                                    animate={{
                                                                        textShadow: ["0 0 10px #0ff", "0 0 15px #bc13fe", "0 0 10px #0ff"]
                                                                    }}
                                                                    transition={{
                                                                        duration: 2,
                                                                        repeat: Infinity
                                                                    }}
                                                                    sx={{
                                                                        color: "#0ff",
                                                                        mt: 2,
                                                                        fontWeight: "bold"
                                                                    }}
                                                                >
                                                                    Total XP: {totalXP.toFixed(2)} KB
                                                                </Typography>
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
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card
                                component={motion.div}
                                whileHover={{ scale: 1.01 }}
                                sx={{
                                    background: "rgba(0, 255, 255, 0.1)",
                                    p: 2,
                                    border: "1px solid rgba(0, 255, 255, 0.3)",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component={motion.div}
                                        animate={{
                                            textShadow: ["0 0 10px #0ff", "0 0 15px #bc13fe", "0 0 10px #0ff"]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        sx={{ color: "#0ff", mb: 2 }}
                                    >
                                        Recent Audits
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ background: "transparent" }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    {["Project Name", "Captain", "Date", "Result"].map((header, index) => (
                                                        <TableCell
                                                            key={index}
                                                            component={motion.th}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.7 + index * 0.1 }}
                                                            sx={{
                                                                color: "#0ff",
                                                                borderBottom: "1px solid #0ff44"
                                                            }}
                                                        >
                                                            {header}
                                                        </TableCell>
                                                    ))}
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
                                                        <TableRow
                                                            key={index}
                                                            component={motion.tr}
                                                            initial={{ opacity: 0, x: -50 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.8 + index * 0.05 }}
                                                            hover
                                                            sx={{
                                                                "&:hover": {
                                                                    backgroundColor: "rgba(0, 255, 255, 0.1)"
                                                                }
                                                            }}
                                                        >
                                                            <TableCell sx={{ color: "white" }}>{audit.group.object.name}</TableCell>
                                                            <TableCell sx={{ color: "white" }}>{audit.group.captainLogin}</TableCell>
                                                            <TableCell sx={{ color: "white" }}>{new Date(audit.closedAt).toLocaleDateString()}</TableCell>
                                                            <TableCell sx={{
                                                                color: audit.closureType === "FAILED" ? "#ff4444" : "#0ff",
                                                                fontWeight: "bold"
                                                            }}>
                                                                {audit.closureType}
                                                            </TableCell>
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