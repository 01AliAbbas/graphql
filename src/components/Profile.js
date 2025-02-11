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
                setXpOverTime(xpData);
            } catch (error) {
                console.error("Failed to fetch XP over time:", error);
            }
        };
        fetchXpData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const renderGraph = () => {
        if (!transactions || transactions.length === 0) {
            return `<svg width="400" height="100"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">No data available</text></svg>`;
        }
    
        // SVG dimensions and padding
        const width = 600;
        const height = 400;
        const padding = { top: 30, right: 30, bottom: 50, left: 60 };
    
        // Parse and sort data
        const parsedData = transactions
            .map(t => ({
                date: new Date(t.createdAt),
                value: parseInt(t.amount)
            }))
            .sort((a, b) => a.date - b.date);
    
        // Calculate scales
        const xExtent = [parsedData[0].date, parsedData[parsedData.length - 1].date];
        const maxY = Math.max(1, ...parsedData.map(d => d.value));
    
        // Scale functions
        const xScale = (date) => 
            padding.left + 
            ((date - xExtent[0]) / (xExtent[1] - xExtent[0])) * 
            (width - padding.left - padding.right);
    
        const yScale = (value) => 
            height - padding.bottom - 
            (value / maxY) * (height - padding.top - padding.bottom);
    
        // Generate path data for the line
        const pathData = parsedData
            .map(d => `L ${xScale(d.date)} ${yScale(d.value)}`)
            .join(' ');
        const fullPath = `M ${xScale(parsedData[0].date)} ${yScale(parsedData[0].value)} ${pathData}`;
    
        // Generate axis ticks
        const xTicks = [xExtent[0], new Date((xExtent[0].getTime() + xExtent[1].getTime()) / 2), xExtent[1]];
        const yTicks = [0, maxY/2, maxY];
    
        return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <style>
                .axis { stroke: #666; stroke-width: 1; }
                .tick { stroke: #ddd; }
                .line { fill: none; stroke: #2196F3; stroke-width: 2; }
                .point { fill: #2196F3; }
                .label { fill: #666; font-size: 12px; }
            </style>
            
            <rect width="100%" height="100%" fill="white" />
            
            <!-- X Axis -->
            <path class="axis" d="M ${padding.left} ${height - padding.bottom} H ${width - padding.right}" />
            ${xTicks.map(date => `
                <g transform="translate(${xScale(date)} ${height - padding.bottom})">
                    <line class="tick" y2="6" />
                    <text class="label" y="25" text-anchor="middle">
                        ${date.toLocaleDateString()}
                    </text>
                </g>
            `).join('')}
            
            <!-- Y Axis -->
            <path class="axis" d="M ${padding.left} ${padding.top} V ${height - padding.bottom}" />
            ${yTicks.map(value => `
                <g transform="translate(${padding.left} ${yScale(value)})">
                    <line class="tick" x2="-6" />
                    <text class="label" x="-10" y="5" text-anchor="end">
                        ${value}
                    </text>
                </g>
            `).join('')}
            
            <path class="line" d="${fullPath.replace(/</g, '&lt;')}" />
            
            ${parsedData.map(d => `
                <circle class="point" cx="${xScale(d.date)}" cy="${yScale(d.value)}" r="3" />
            `).join('')}
            
            <text class="label" x="${width/2}" y="${height - 10}">Date</text>
            <text class="label" transform="rotate(-90)" x="-${height/2}" y="15">XP</text>
            <text class="label" x="${width/2}" y="20">XP Over Time</text>
        </svg>`;
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
                    <Grid item xs={12} md={6}>
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
                    <Grid item xs={12} md={6}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card sx={{ background: "rgba(0, 255, 255, 0.1)", p: 2, boxShadow: "0px 0px 20px #0ff" }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Audit Ratio</Typography>
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
                                    <Typography variant="h6" sx={{ color: "#0ff" }}>XP Over Time</Typography>
                                    <div dangerouslySetInnerHTML={{ __html: renderGraph() }} />
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
