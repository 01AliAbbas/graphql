import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
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
    Paper, LinearProgress
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import * as data from "./data";
import AuditCard from "./auditCard";

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
                    date: new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                    xp: tx.amount / 1000,
                    obj: tx.object.name
                }));

                setXpOverTime(formattedData);
                // Calculate total XP
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
    // Get the skills
    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                const skillsData = await data.fetchSkills();

                // Define allowed skill types
                const allowedTypes = ['skill_prog', 'skill_go', 'skill_back-end', 'skill_front-end', 'skill_js', 'skill_html'];

                // Aggregate skills by type
                const skillData = skillsData.reduce((acc, { amount, type }) => {
                    const skillType = type.replace('skill_', ''); // Remove 'skill_' prefix
                    // Check if the skill type is allowed
                    if (!allowedTypes.includes(type.toLowerCase())) return acc;

                    acc[skillType] = ((acc[skillType] || 0) + amount) / 1000; // Convert to KB
                    return acc;
                }, []);

                console.log("Filtered & Aggregated Skills data:", skillData);
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
            }}
        >
            <Container sx={{ position: "relative", textAlign: "center", }}>
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
                    <Grid container spacing={3} sx={{ mt: 4 }}>
                        <Grid item xs={12}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2, boxShadow: "0px 0px 20px #0ff", }}>
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <AuditCard user={user} />
                                    )}
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2, boxShadow: "0px 0px 20px #0ff" }}>
                                <CardContent>
                                    <Box sx={{ minHeight: "50vh", background: "#1a1a2e", p: 3 }}>
                                        <Container maxWidth="59vh" sx={{ textAlign: "center" }}>
                                            <Typography variant="h4" sx={{ color: "#0ff", fontWeight: "bold" }}>
                                                Interesting Information
                                            </Typography>
                                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                                <Grid item xs={12} md={6}>
                                                    <motion.div whileHover={{ scale: 1.05 }}>
                                                        <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2 }}>
                                                            <CardContent>
                                                                {loading ? (
                                                                    <CircularProgress size={24} />
                                                                ) : (
                                                                    <ResponsiveContainer width="95%" height={300}>
                                                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skills}>
                                                                            <text x="50%" y="10" textAnchor="middle" dominantBaseline="middle" fill="white">XP by Skill Type</text>
                                                                            <PolarGrid />
                                                                            <PolarAngleAxis dataKey="type" tick={{ fontSize: 14, fill: "#0ff" }} />
                                                                            {/* <PolarRadiusAxis angle={180} domain={[0, Math.max(...skills.map(item => item.xp))]} /> */}
                                                                            <Radar name="XP" dataKey="xp" stroke="#0ff" fill="#0ff" fillOpacity={0.6} />
                                                                            <Tooltip contentStyle={{ backgroundColor: "#16213e", color: "white" }} />
                                                                        </RadarChart>
                                                                    </ResponsiveContainer>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <motion.div whileHover={{ scale: 1.05 }}>
                                                        <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2 }}>
                                                            <CardContent>
                                                                {loading ? (
                                                                    <CircularProgress size={24} />
                                                                ) : (
                                                                    <ResponsiveContainer width="95%" height={300}>
                                                                        <LineChart data={transactions}>
                                                                            <text x="50%" y="10" textAnchor="middle" dominantBaseline="middle" fill="white">XP Over Time</text>
                                                                            <XAxis dataKey="date" stroke="white" interval={25} angle={-45} textAnchor="end" height={100} />
                                                                            <YAxis stroke="#0ff" tickCount={30} label={{ value: "XP (KB)", angle: -90, position: "insideLeft" }} domain={['auto', 'auto']} />
                                                                            <Tooltip
                                                                                content={({ active, payload }) => {
                                                                                    if (active && payload && payload.length) {
                                                                                        const data = payload[0].payload; // Get the data object for the hovered point
                                                                                        const sameDateObjects = payload.map(entry => entry.payload.obj); // Extract all object names

                                                                                        return (
                                                                                            <div style={{ backgroundColor: "#16213e", color: "white", padding: "8px", borderRadius: "5px" }}>
                                                                                                <p style={{ margin: 0 }}>📅 {data.date}</p>
                                                                                                <p style={{ margin: 0 }}>⚡ Total XP: {data.xp.toFixed(2)} KB</p>
                                                                                                <ul style={{ padding: 0, margin: 0 }}>
                                                                                                    {sameDateObjects.map((objName, index) => (
                                                                                                        <li key={index} style={{ listStyle: "none" }}>🔹 {objName}</li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                    return null;
                                                                                }}
                                                                            />


                                                                            <Line type="monotone" dataKey="xp" stroke="#0ff" strokeWidth={2} dot={{ r: 1, fill: "white", stroke: "white", strokeOpacity: 60 }} />
                                                                        </LineChart>
                                                                        <Typography>
                                                                            Total XP: {totalXP.toFixed(2)} KB
                                                                        </Typography>
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
