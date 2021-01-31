const Discord = require("discord.js");
const client = new Discord.Client();

const Tasks = require("../services/tasks");
const Tracker = require("../services/tracker");

var textChannel = null;

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  //client.user.setAvatar('\img\\man.png')
  client.user.setActivity("you", { type: "WATCHING" });

  // Assigns an private #activity-logs text channel for the bot to record logs.
  var check = true;
  client.channels.cache.forEach((channel) => {
    // Checks if #activity-logs already exists.
    if (channel.type === "text") {
      textChannel = channel.id;
      check = false;
      return;
    }
  });
});

// Triggers when a user joins/leaves a voice channel
client.on("voiceStateUpdate", (oldMember, newMember) => {
  // Attributes
  var newChannel = newMember.channelID; // New voice channel.
  var oldChannel = oldMember.channelID; // Previous voice channel.
  var userID = newMember.member.id; // User's ID.
  var username = client.users.cache.get(userID).username; // User's username.
  var userTag = client.users.cache.get(userID).tag; // User's tag.

  // Triggered if user newly joins the server.
  if (
    newMember.channel != null &&
    !newMember.member.hasPermission("ADMINISTRATOR") &&
    !(newMember.channel.name === userTag)
  ) {
    // Creates a private channel for newly joined user.
    newMember.guild.channels
      .create(userTag, {
        type: "voice",
        permissionOverwrites: [
          {
            id: newMember.guild.roles.everyone.id, // removes permissions from @everyone
            deny: "VIEW_CHANNEL",
          },
        ],
      })
      .then((m) => {
        if (m.type === "voice" && m.name === userTag) {
          newMember.setChannel(m.id); // Moves the user to the new private voice channel.
          console.log(userID);
          Tracker.addHuman({ username, discord_room: m.id, userID }, (done) => {

            Tasks.assignTask(username, (task) => {
              client.users.cache.get(userID).send(`Your task is ${task.task_name} and you must ${task.description}... its estimation is around ${task.estimation}`);

              if (!task) {
                console.log("no tasks to do...");
                return done(false);
              }

              Tracker.scheduleUserTask(username, task, client, textChannel);
            });
          });
        }
      });
  }

  //  Triggered if user leaves the server.
  if (oldMember.channel != null && oldMember.channel.name === userTag) {
    client.channels.cache.get(oldChannel).delete(); // Deletes the user's private voice channel
  }
});


client.on("message", (message) => {
  if (message.channel.type === "dm") {
    let input = message.content;
    console.log(input);
  }
});

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"

client.login(process.env.DISCORD_TOKEN);
