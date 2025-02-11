import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
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
    const cardStyle = {
        borderRadius: 2,
        backdropFilter: "blur(10px)",
        p: 2,
        width: "90%",
        height: "auto",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
            transform: "translateY(-5px)",
        },
    };
    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                p: 2,
            }}
        >
            <Container maxWidth="md" sx={{ position: "relative", minWidth: "150vh", padding: "16px", px: { xs: 2, md: 4 }, }}>

                <Typography
                    variant="h4"
                    sx={{ color: "#fff", fontWeight: "bold", textAlign: "center", mb: 3 }}
                >
                    Dashboard
                </Typography>
                <IconButton
                    onClick={handleLogout}
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        m: 2,
                        color: "#fff",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.4)" },
                    }}
                >
                    <LogoutIcon />
                </IconButton>

                {/* First Section - Three Cards */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        backgroundColor: "rgba(150, 146, 146, 0.63)",
                        borderRadius: 2,
                        p: 2,
                        mb: 3,
                    }}
                >
                    <Typography variant="h6" sx={{ color: "#fff" }}>
                        Section 1
                    </Typography>
                    <Grid container spacing={2}>
                        {/* Card 1: User Info */}
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={cardStyle}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        {user?.login} details
                                    </Typography>
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <>
                                            <Typography>Name: {user?.firstName} {user?.lastName}</Typography>
                                            <Typography>Email: {user?.email}</Typography>
                                            <Typography>Joind At: {new Date(user?.createdAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                            }</Typography>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* Card 2: Interesting Info */}
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={cardStyle}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Interesting Information
                                    </Typography>
                                    <Typography>
                                        Show some interesting stats or details here.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* Card 3: Audit Ratio */}
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={cardStyle}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Audit Ratio
                                    </Typography>
                                    <Typography>
                                        your audit ratio is {user?.auditRatio.toFixed(1)}
                                    </Typography>
                                    <Typography>
                                        Done {Math.round((user?.totalUp / (1024 * 1024)) * 100) / 100} MB
                                    </Typography>
                                    <Typography>
                                        Received {Math.round((user?.totalDown / (1024 * 1024)) * 100) / 100} MB
                                    </Typography>

                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Second Section - Two Cards with SVG Graphs */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        backgroundColor: "rgba(150, 146, 146, 0.63)",
                        borderRadius: 2,
                        p: 2,
                        mb: 3,
                    }}
                >
                    <Typography variant="h6" sx={{ color: "#fff" }}>
                        Section 2
                    </Typography>
                    <Grid container spacing={2}>
                        {/* Card 1 with Graph */}
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={cardStyle}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Graph 1
                                    </Typography>
                                    <Typography>
                                        Here you might use a chart library like Recharts or Chart.js
                                        to render an SVG graph.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* Card 2 with Graph */}
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={cardStyle}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Graph 2
                                    </Typography>
                                    <Typography>
                                        Another placeholder for an SVG-based chart or any data visualization.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Third Section - Single Card with a Table */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        backgroundColor: "rgba(150, 146, 146, 0.63)",
                        borderRadius: 2,
                        p: 2,
                        mb: 3,
                    }}
                >
                    <Typography variant="h6" sx={{ color: "#fff" }}>
                        Section 3
                    </Typography>
                    <Card
                        sx={cardStyle}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Recent Audits
                            </Typography>
                            <TableContainer component={Paper} sx={{ margin: "0 auto", width: "80%" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Project Name</TableCell>
                                            <TableCell>Captain</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Result</TableCell>
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
                                            // console.log("recent audits variable: ", recentAudits),
                                            recentAudits?.audits?.map((audit, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{audit.group.object.name}</TableCell>
                                                    <TableCell>{audit.group.captainLogin}</TableCell>
                                                    <TableCell>{new Date(audit.closedAt).toLocaleDateString("en-US", {
                                                        month: "long",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}</TableCell>
                                                    <TableCell>{audit.closureType}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}

export default Profile;