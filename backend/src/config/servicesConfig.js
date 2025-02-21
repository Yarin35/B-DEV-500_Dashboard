const services = [
    {
        id: 1,
        name: "Google",
        description: "Google services",
        registration_required: true,
        homepage_link: "/homepage.html",
        privacy_policy_link: "/privacy-policy.html",
        widgets: [
            { id: 1, name: "Google Calendar Events", config: { fields: ["calendarId"], refreshRate: 60000 } },
            { id: 2, name: "YouTube Subscribers", config: { fields: ["channelId"], refreshRate: 60000 } },
            { id: 3, name: "YouTube Video Views", config: { fields: ["videoId"], refreshRate: 60000 } },
            { id: 4, name: "YouTube Video Comments", config: { fields: ["videoId", "commentCount"], refreshRate: 60000 } },
        ],
    },
    {
        id: 2,
        name: "Weather",
        description: "Weather services",
        registration_required: false,
        homepage_link: "/homepage.html",
        privacy_policy_link: "/privacy-policy.html",
        widgets: [
            { id: 5, name: "Current Weather", config: { fields: ["location"], refreshRate: 60000 } },
            { id: 6, name: "Forecast Weather", config: { fields: ["location"], refreshRate: 60000 } },
        ],
    },
];

module.exports = services;