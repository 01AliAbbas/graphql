import { CardContent, Typography, LinearProgress, Box, Card, Grid } from "@mui/material";

const AuditCard = ({ user }) => {
    const done = user?.totalUp || 0;
    const received = user?.totalDown || 1; // Prevent division by zero
    const ratio = (done / received).toFixed(1);

    // Determine progress percentages
    const receivedBar = 100; // Received is always 100%
    const doneBar = Math.min((done / received) * 100, 100); // Done relative to received

    // Dynamic Colors
    const doneColor = done > received ? "#4CAF50" : "#ffffff"; // Green if more done, else white
    const receivedColor = received > done ? "#FF5733" : "#FF8A65"; // Red if more received, else orange

    return (
        <Grid container spacing={2} sx={{ minHeight: "100%"  }}>
    {/* User Details Card (Left Side) */}
    <Grid item xs={12} md={6}>
        <Card sx={{ backgroundColor: "rgba(0, 255, 255, 0.1)", color: "#fff", p: 3, borderRadius: 2, minHeight: "40vh" }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: "#0ff", mb: 1 }}>User Details</Typography>
                {
               (
                    <>
                        <Typography>Name: {user?.firstName} {user?.lastName}</Typography>
                        <Typography>Email: {user?.email}</Typography>
                        <Typography>Joined At: {new Date(user?.createdAt).toLocaleDateString()}</Typography>
                        <Typography>Level: {user?.events[0].level}</Typography>
                    </>
                )}
            </CardContent>
        </Card>
    </Grid>

    {/* Audit Ratio Card (Right Side) */}
    <Grid item xs={12} md={6}>
        <Card sx={{ backgroundColor: "rgba(0, 255, 255, 0.1)", color: "#fff", p: 3, borderRadius: 2, minHeight: "40vh" }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: "#ccc", mb: 1 }}>Audits Ratio</Typography>

                {/* Done Progress */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: "0.9rem", color: "#bbb" }}>Done</Typography>
                    <Typography sx={{ fontSize: "0.9rem", color: doneColor }}>{done.toFixed(2)} MB ↑</Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={doneBar} 
                    sx={{ height: 6, backgroundColor: "#333", "& .MuiLinearProgress-bar": { backgroundColor: doneColor }, borderRadius: 2, mb: 1 }} 
                />

                {/* Received Progress */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: "0.9rem", color: "#bbb" }}>Received</Typography>
                    <Typography sx={{ fontSize: "0.9rem", color: receivedColor }}>{received.toFixed(2)} MB ↓</Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={receivedBar} 
                    sx={{ height: 6, backgroundColor: "#333", "& .MuiLinearProgress-bar": { backgroundColor: receivedColor }, borderRadius: 2, mb: 2 }} 
                />

                {/* Ratio */}
                <Typography sx={{ fontSize: "3rem", fontWeight: "bold", color: receivedColor }}>{ratio}</Typography>
                <Typography sx={{ fontSize: "0.9rem", color: receivedColor }}>
                    {ratio < 1 ? "Make more audits!" : "Great job!"}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
</Grid>

    );
};

export default AuditCard;
