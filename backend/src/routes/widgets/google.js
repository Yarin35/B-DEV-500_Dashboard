const express = require("express");
const axios = require("axios");
const db = require("../../../config/db");
const router = express.Router();

const verifyGoogleAccessToken = async (accessToken) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "1-Invalid Google OAuth 2.0 access token:",
      error.response.data
    );
    return null;
  }
};

const refreshGoogleAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`https://oauth2.googleapis.com/token`, {
      client_id: process.env.GOOGLE_ID,
      client_secret: process.env.GOOGLE_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error refreshing Google OAuth 2.0 access token:",
      error.response.data
    );
    return null;
  }
};

router.get("/1/data", async (req, res) => {
  const { calendarId } = req.query;
  let accessToken = req.headers.authorization.split(" ")[1];
  const userId = req.headers["x-user-id"];

  let tokenInfo = await verifyGoogleAccessToken(accessToken);
  if (!tokenInfo) {
    const [user] = await db.execute(
      "SELECT refresh_token FROM users WHERE id = ?",
      [userId]
    );
    accessToken = await refreshGoogleAccessToken(user[0].refresh_token);
    if (!accessToken) {
      return res.status(401).send("2-Invalid Google OAuth 2.0 access token");
    }
    await db.execute("UPDATE users SET access_token = ? WHERE id = ?", [
      accessToken,
      userId,
    ]);
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    res.status(500).send("Error fetching Google Calendar events");
  }
});

router.get("/2/data", async (req, res) => {
  const { channelId } = req.query;
  let accessToken = req.headers.authorization.split(" ")[1];
  const userId = req.headers["x-user-id"];

  let tokenInfo = await verifyGoogleAccessToken(accessToken);
  if (!tokenInfo) {
    const [user] = await db.execute(
      "SELECT refresh_token FROM users WHERE id = ?",
      [userId]
    );
    accessToken = await refreshGoogleAccessToken(user[0].refresh_token);
    if (!accessToken) {
      return res.status(401).send("2-Invalid Google OAuth 2.0 access token");
    }
    await db.execute("UPDATE users SET access_token = ? WHERE id = ?", [
      accessToken,
      userId,
    ]);
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels`,
      {
        params: {
          part: "statistics",
          id: channelId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data.items[0].statistics.subscriberCount);
  } catch (error) {
    console.log("Access token is:", accessToken);
    console.error("Error fetching YouTube subscribers:", error.response.data);
    console.error("Channel ID:", channelId);
    res.status(500).send("Error fetching YouTube subscribers");
  }
});

router.get("/3/data", async (req, res) => {
  const { videoId } = req.query;
  let accessToken = req.headers.authorization.split(" ")[1];
  const userId = req.headers["x-user-id"];

  let tokenInfo = await verifyGoogleAccessToken(accessToken);
  if (!tokenInfo) {
    const [user] = await db.execute(
      "SELECT refresh_token FROM users WHERE id = ?",
      [userId]
    );
    accessToken = await refreshGoogleAccessToken(user[0].refresh_token);
    if (!accessToken) {
      return res.status(401).send("2-Invalid Google OAuth 2.0 access token");
    }
    await db.execute("UPDATE users SET access_token = ? WHERE id = ?", [
      accessToken,
      userId,
    ]);
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: "statistics",
          id: videoId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data.items[0].statistics.viewCount);
  } catch (error) {
    console.error("Error fetching YouTube video views:", error);
    res.status(500).send("Error fetching YouTube video views");
  }
});

router.get("/4/data", async (req, res) => {
  const { videoId, commentCount } = req.query;
  let accessToken = req.headers.authorization.split(" ")[1];
  const userId = req.headers["x-user-id"];

  let tokenInfo = await verifyGoogleAccessToken(accessToken);
  if (!tokenInfo || !tokenInfo.scope.includes("https://www.googleapis.com/auth/youtube.force-ssl")) {
    const [user] = await db.execute(
      "SELECT refresh_token FROM users WHERE id = ?",
      [userId]
    );
    accessToken = await refreshGoogleAccessToken(user[0].refresh_token);
    if (!accessToken) {
      return res.status(401).send("2-Invalid Google OAuth 2.0 access token");
    }
    await db.execute("UPDATE users SET access_token = ? WHERE id = ?", [
      accessToken,
      userId,
    ]);
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads`,
      {
        params: {
          part: "snippet",
          videoId: videoId,
          maxResults: commentCount || 0,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(
      response.data.items.map(
        (item) => item.snippet.topLevelComment.snippet.textDisplay
      )
    );
  } catch (error) {
    console.error("Error fetching YouTube video comments:", error.response ? error.response.data : error.message);
    res.status(500).send("Error fetching YouTube video comments");
  }
});

module.exports = router;
