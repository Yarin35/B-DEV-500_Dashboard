const services = [
    {
        id: 1,
        name: "Google",
        description: "Google services",
        registration_required: true,
        widgets: [
            { id: 1, name: "Google Calendar", config: { fields: ["calendarId"] } },
            { id: 2, name: "YouTube Subscribers", config: { fields: ["channelId"] } },
            { id: 3, name: "YouTube Video Views", config: { fields: ["videoId"] } },
            { id: 4, name: "YouTube Video Comments", config: { fields: ["videoId", "commentCount"] } },
        ],
    },
    {
        id: 2,
        name: "Weather",
        description: "Weather services",
        registration_required: false,
        widgets: [
            { id: 5, name: "Current Weather", config: { fields: ["location"] } },
            { id: 6, name: "Forecast Weather", config: { fields: ["location"] } },
        ],
    },
];

module.exports = services;