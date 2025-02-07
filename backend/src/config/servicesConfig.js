const services = [
    {
        id: 1,
        name: "Google",
        description: "Google services",
        registration_required: true,
        widgets: [
            { id: 1, name: "Google Calendar", config: {} },
            { id: 2, name: "Google Drive", config: {} },
            { id: 3, name: "Google Maps", config: {} },
        ],
    },
    {
        id: 2,
        name: "Weather",
        description: "Weather services",
        registration_required: false,
        widgets: [
            { id: 4, name: "Current Weather", config: {} },
            { id: 5, name: "5 Day Forecast", config: {} },
        ],
    },
];

module.exports = services;