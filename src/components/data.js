export async function fetchUsers() {
    try {
        const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                query: `
                    query {
                        user {
                            id
                            login
                            email
                            firstName
                            lastName
                            createdAt
                            auditRatio
                            totalDown
                            totalUp
                        }
                    }
                `,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Fetched users:", data);
        return data.data.user;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export async function fetchRecentAudits() {
    try {
        const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                query: `query User {
                    user {
                        audits(order_by: { auditedAt: desc_nulls_last }, limit: 5) {
                            closedAt
                            closureType
                            group {
                                captainLogin
                                object {
                                    name
                                }
                            }
                        }
                    }
                    
                }
                `,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching recent audits: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Recent audits:", data);
        return data.data.user[0];
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export async function fetchXpOverTime() {
    try {
        const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                query: `
                    query User {
                            user {
                                transactions (where: { type: { _eq: "xp" } }, , order_by: {createdAt: asc_nulls_last}){
                                    amount
                                    createdAt
                                }
                            }
                        }

                `,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching XP over time: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched XP over time:", data);
        return data.data.user[0].transactions;
    } catch (error) {
        console.error("Error fetching XP over time:", error);
        throw error;
    }
}

export async function fetchSkills(){
    try {
        const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                query: `
                    query User {
                        user {
                            transactions(where: { type: { _like: "skill_%" } }) {
                                type
                                amount
                            }
                        }
                    }
                `,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching XP over time: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched XP over time:", data);
        return data.data.user[0].transactions;
    } catch (error) {
        console.error("Error fetching XP over time:", error);
        throw error;
    }
}