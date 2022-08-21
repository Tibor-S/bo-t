const Discord = require("discord.io");
const logger = require("winston");
const auth = require("./auth.json");
const acquire = require("./acquire");
let targetChannelID = "0";

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";

// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth["discord-token"],
  autorun: true,
});

bot.on("ready", function (evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("message", async (user, userID, channelID, message, evt) => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == "!") {
    var arg = message.substring(1).toLowerCase()[0];
    var cmd = arg;
    switch (cmd) {
      case "s":
        logger.info("Sending status");
        bot.sendMessage({
          to: channelID,
          message:
            targetChannelID !== "0"
              ? `Online in channel ${targetChannelID} :)`
              : "Missing a target channel.\nTarget a channel by typing !target in the desired channel.",
        });
        break;

      case "t":
        logger.info("Setting target");
        targetChannelID = channelID;
        bot.sendMessage({
          to: channelID,
          message: `Now targeting channel ${channelID}`,
        });
        break;

      case "l":
        logger.info("Getting userID");
        const uID = await acquire.userID();
        logger.info("Getting tweetID");
        const tID = await acquire.latestID(await uID);
        logger.info("Getting media URL");
        const mURL = await acquire.tweetMediaURL(tID);
        logger.info("Sending latest");
        bot.sendMessage({
          to: targetChannelID !== "0" ? targetChannelID : channelID,
          message:
            targetChannelID !== "0"
              ? await mURL
              : "Missing a target channel.\nTarget a channel by typing !target in the desired channel.",
        });
        break;

      case "d":
        logger.info("Disconnecting");
        bot.disconnect();
        break;
      // Just add any case commands if you want to..
    }
  }
});
