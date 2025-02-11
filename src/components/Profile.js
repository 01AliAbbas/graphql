import React, { useState, useEffect } from "react";
import { keyframes, styled } from "@mui/system";
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

// Color Palette
const COLORS = {
  electric: "#4ec9ff",
  purple: "#b362ff",
  pink: "#ff61fa",
  green: "#7fff00",
  red: "#ff3366",
  background: "#0a0a18",
  foreground: "#1a1a2f",
  accent: "rgba(78, 201, 255, 0.1)"
};

// Animations
const glitch = keyframes`
  0% { text-shadow: 0.05em 0 0 ${COLORS.purple}, -0.025em -0.05em 0 ${COLORS.electric}, 0.025em 0.05em 0 ${COLORS.pink}; }
  15% { text-shadow: -0.05em -0.025em 0 ${COLORS.purple}, 0.025em 0.025em 0 ${COLORS.electric}, -0.05em -0.05em 0 ${COLORS.pink}; }
  50% { text-shadow: 0.025em 0.05em 0 ${COLORS.purple}, 0.05em 0 0 ${COLORS.electric}, 0 -0.05em 0 ${COLORS.pink}; }
  100% { text-shadow: -0.025em 0 0 ${COLORS.purple}, -0.025em -0.025em 0 ${COLORS.electric}, -0.025em -0.05em 0 ${COLORS.pink}; }
`;

const hologram = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const CyberButton = styled(IconButton)({
  border: `2px solid ${COLORS.electric}`,
  background: `linear-gradient(45deg, ${COLORS.purple} 0%, ${COLORS.pink} 100%)`,
  color: "#fff",
  '&:hover': {
    background: `linear-gradient(45deg, ${COLORS.pink} 0%, ${COLORS.purple} 100%)`,
    boxShadow: `0 0 20px ${COLORS.purple}`,
  },
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
});

const CyberCard = styled(Card)({
  background: COLORS.foreground,
  border: `1px solid ${COLORS.purple}`,
  borderRadius: "4px",
  boxShadow: `0 0 15px ${COLORS.accent}`,
  position: "relative",
  overflow: "hidden",
  '&:before': {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: `linear-gradient(45deg, transparent 25%, ${COLORS.accent} 25%, ${COLORS.accent} 50%, transparent 50%, transparent 75%, ${COLORS.accent} 75%, ${COLORS.accent})`,
    backgroundSize: "4px 4px",
    transform: "rotate(45deg)",
    animation: `${hologram} 4s linear infinite`,
  },
  '&:hover': {
    boxShadow: `0 0 25px ${COLORS.pink}`,
    transform: "translateY(-3px)",
  },
});

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [recentAudits, setAudits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [users, audits] = await Promise.all([
                    data.fetchUsers(),
                    data.fetchRecentAudits()
                ]);
                
                if (!users?.length) throw new Error("No user data found");
                if (!audits?.audits) throw new Error("No audit data found");

                setUser(users[0]);
                setAudits(audits);
                setError(null);
            } catch (err) {
                console.error("Data retrieval error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box sx={{
            minHeight: "100vh",
            background: `radial-gradient(circle at center, ${COLORS.background} 0%, #000016 100%)`,
            p: 2,
            color: "#fff",
            fontFamily: '"Orbitron", sans-serif',
        }}>
            <Container maxWidth="md" sx={{ 
                position: "relative",
                padding: "16px",
                px: { xs: 2, md: 4 },
            }}>
                {/* Header */}
                <Typography variant="h4" sx={{
                    textAlign: "center",
                    mb: 3,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    animation: `${glitch} 2s infinite`,
                    background: `linear-gradient(45deg, ${COLORS.electric}, ${COLORS.pink})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: `0 0 20px ${COLORS.accent}`,
                }}>
                    Cyber Nexus Dashboard
                </Typography>

                <CyberButton onClick={handleLogout} sx={{ position: "absolute", top: 0, right: 0, m: 2 }}>
                    <LogoutIcon sx={{ filter: `drop-shadow(0 0 2px ${COLORS.electric})` }} />
                </CyberButton>

                {/* Main Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* User Profile Card */}
                    <Grid item xs={12} md={4}>
                        <CyberCard>
                            <CardContent>
                                <Typography variant="h6" sx={{
                                    mb: 2,
                                    color: COLORS.electric,
                                    borderBottom: `2px solid ${COLORS.purple}`,
                                    paddingBottom: "0.5rem",
                                }}>
                                    USER PROFILE
                                </Typography>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <CircularProgress sx={{ color: COLORS.electric }} />
                                    </Box>
                                ) : error ? (
                                    <Typography sx={{ color: COLORS.red }}>ERROR: {error}</Typography>
                                ) : (
                                    <Box sx={{ 
                                        '& > *': { 
                                            margin: "0.5rem 0",
                                            fontFamily: '"Rajdhani", sans-serif',
                                            fontWeight: 500 
                                        }
                                    }}>
                                        <Typography>IDENTITY: {user?.firstName} {user?.lastName}</Typography>
                                        <Typography>CODENAME: {user?.login}</Typography>
                                        <Typography>REGISTERED: {formatDate(user?.createdAt)}</Typography>
                                        <Typography sx={{ pt: 2, color: COLORS.purple }}>
                                            AUDIT RATIO: {user?.auditRatio?.toFixed(1) || "N/A"}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </CyberCard>
                    </Grid>

                    {/* Data Flow Card */}
                    <Grid item xs={12} md={4}>
                        <CyberCard>
                            <CardContent>
                                <Typography variant="h6" sx={{
                                    mb: 2,
                                    color: COLORS.purple,
                                    borderBottom: `2px solid ${COLORS.electric}`,
                                    paddingBottom: "0.5rem",
                                }}>
                                    DATA FLOW
                                </Typography>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <CircularProgress sx={{ color: COLORS.purple }} />
                                    </Box>
                                ) : error ? (
                                    <Typography sx={{ color: COLORS.red }}>ERROR: {error}</Typography>
                                ) : (
                                    <Box sx={{ 
                                        '& > *': { 
                                            margin: "0.5rem 0",
                                            fontFamily: '"Rajdhani", sans-serif',
                                            fontWeight: 500 
                                        }
                                    }}>
                                        <Typography>UPLOAD: {Math.round((user?.totalUp / 1024 ** 2) * 100) / 100} MB</Typography>
                                        <Typography>DOWNLOAD: {Math.round((user?.totalDown / 1024 ** 2) * 100) / 100} MB</Typography>
                                        <Typography sx={{ pt: 2, color: COLORS.electric }}>
                                            TOTAL TRANSFER: {Math.round((user?.totalUp + user?.totalDown) / 1024 ** 2 * 100) / 100} MB
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </CyberCard>
                    </Grid>

                    {/* System Status Card */}
                    <Grid item xs={12} md={4}>
                        <CyberCard>
                            <CardContent>
                                <Typography variant="h6" sx={{
                                    mb: 2,
                                    color: COLORS.electric,
                                    borderBottom: `2px solid ${COLORS.purple}`,
                                    paddingBottom: "0.5rem",
                                }}>
                                    SYSTEM STATUS
                                </Typography>
                                <Box sx={{ 
                                    '& > *': { 
                                        margin: "0.5rem 0",
                                        fontFamily: '"Rajdhani", sans-serif',
                                        fontWeight: 500 
                                    }
                                }}>
                                    <Typography>CONNECTION: <span style={{ color: COLORS.green }}>SECURE</span></Typography>
                                    <Typography>ENCRYPTION: AES-256</Typography>
                                    <Typography sx={{ color: COLORS.purple }}>
                                        LAST UPDATE: {formatDate(new Date())}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </CyberCard>
                    </Grid>
                </Grid>

                {/* Audit Logs Table */}
                <CyberCard sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{
                            mb: 2,
                            color: COLORS.purple,
                            borderBottom: `2px solid ${COLORS.electric}`,
                            paddingBottom: "0.5rem",
                        }}>
                            RECENT AUDIT LOGS
                        </Typography>
                        <TableContainer component={Paper} sx={{
                            background: "rgba(0, 0, 0, 0.7)",
                            border: `2px solid ${COLORS.electric}`,
                            boxShadow: `0 0 30px ${COLORS.accent}`,
                        }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{
                                        background: `linear-gradient(45deg, ${COLORS.background}, ${COLORS.foreground})`,
                                    }}>
                                        <TableCell sx={{ color: `${COLORS.electric} !important`, borderRight: `1px solid ${COLORS.electric} !important` }}>PROJECT</TableCell>
                                        <TableCell sx={{ color: `${COLORS.purple} !important`, borderRight: `1px solid ${COLORS.electric} !important` }}>CAPTAIN</TableCell>
                                        <TableCell sx={{ color: `${COLORS.electric} !important`, borderRight: `1px solid ${COLORS.electric} !important` }}>DATE</TableCell>
                                        <TableCell sx={{ color: `${COLORS.purple} !important` }}>STATUS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <CircularProgress sx={{ color: COLORS.electric }} />
                                            </TableCell>
                                        </TableRow>
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ color: COLORS.red }}>
                                                ERROR: {error}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recentAudits?.audits?.map((audit, index) => (
                                            <TableRow key={index} sx={{
                                                '&:hover': {
                                                    background: "rgba(0, 255, 255, 0.05)",
                                                },
                                                transition: "all 0.3s ease",
                                            }}>
                                                <TableCell sx={{ color: COLORS.electric }}>{audit.group.object.name}</TableCell>
                                                <TableCell sx={{ color: COLORS.purple }}>{audit.group.captainLogin}</TableCell>
                                                <TableCell sx={{ color: COLORS.electric }}>{formatDate(audit.closedAt)}</TableCell>
                                                <TableCell sx={{ 
                                                    color: audit.closureType === "SUCCESS" ? COLORS.green : COLORS.red,
                                                    fontWeight: "bold",
                                                }}>{audit.closureType}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </CyberCard>

                {/* Animated Background */}
                <Box sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    background: `
                        linear-gradient(
                            0deg,
                            transparent 24%,
                            ${COLORS.accent} 25%,
                            ${COLORS.accent} 26%,
                            transparent 27%,
                            transparent 74%,
                            ${COLORS.accent} 75%,
                            ${COLORS.accent} 76%,
                            transparent 77%,
                            transparent
                        ),
                        linear-gradient(
                            90deg,
                            transparent 24%,
                            ${COLORS.accent} 25%,
                            ${COLORS.accent} 26%,
                            transparent 27%,
                            transparent 74%,
                            ${COLORS.accent} 75%,
                            ${COLORS.accent} 76%,
                            transparent 77%,
                            transparent
                        )`,
                    backgroundSize: "50px 50px",
                    animation: `${hologram} 20s linear infinite`,
                    opacity: 0.3,
                }} />
            </Container>
        </Box>
    );
}

export default Profile;