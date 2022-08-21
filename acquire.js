const auth = require("./auth.json");
const twitterBearerToken = auth["twitter-bearer-token"]; // App token
const fetch = (await import("node-fetch")).default;
const accName = "RedPandaEveryHr";

const userID = async () => {
  let userID = await fetch(
    `https://api.twitter.com/2/users/by/username/${accName}`,
    {
      headers: {
        Authorization: `Bearer ${twitterBearerToken}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      return data.data.id;
    });

  return await userID;
};

const latestID = async (userID) => {
  const options = ["max_results=5", "exclude=retweets,replies"];

  const latestID = await await fetch(
    `https://api.twitter.com/2/users/${userID}/tweets?${options.join("&")}`,
    {
      headers: {
        Authorization: `Bearer ${twitterBearerToken}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      return data.data[0].id;
    });
  return await latestID;
};

const tweetMediaURL = async (tweetID) => {
  const options = [
    `ids=${tweetID}`,
    "expansions=attachments.media_keys",
    "media.fields=duration_ms,height,media_key,preview_image_url,public_metrics,type,url,width,alt_text",
  ];

  const url = await fetch(
    `https://api.twitter.com/2/tweets?${options.join("&")}`,
    {
      headers: {
        Authorization: `Bearer ${twitterBearerToken}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.includes.media[0].url);
  return url;
};

module.exports = { userID, latestID, tweetMediaURL };
