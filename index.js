const Discord = require("discord.io");
const logger = require("winston");
const auth = require("./auth.json");
let targetChannelID = 0;

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

// bot.sendMessage();

bot.on("message", function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 2) == "/*") {
    var arg = message.substring(1);
    var cmd = arg;

    switch (cmd) {
      // /*status

      case "status":
        bot.sendMessage({
          to: channelID,
          message:
            channelID !== 0
              ? `Online in channel ${targetChannelID} :)`
              : "Missing a target channel.\n\nTarget a channel by typing /*target in the desired channel.",
        });
        break;

      case "target":
        targetChannelID = channelID;
        bot.sendMessage({
          to: channelID,
          message: `Now targeting channel ${channelID}`,
        });
        break;
      // Just add any case commands if you want to..
    }
  }
});
