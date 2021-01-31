const Discord = require('discord.js');
const client = new Discord.Client();

const Tasks = require('../services/tasks');
const Tracker = require('../services/tracker');

var textChannel = null;


client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
    //client.user.setAvatar('\img\\man.png')
    client.user.setActivity('you', { type: 'WATCHING' });

    // Assigns an private #activity-logs text channel for the bot to record logs.
    var check = true;
    client.channels.cache.forEach((channel) => { // Checks if #activity-logs already exists.
        if (channel.type === 'text' && channel.name === 'activity-logs') {
            textChannel = channel.id;
            check = false;
            return;
        }
    })
    client.channels.cache.get(textChannel).send('All hail the manager. Are you OnTask?'); // Bot connect to server message
})

// Triggers when a user joins/leaves a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {

    // Attributes
    var newChannel = newMember.channelID; // New voice channel.
    var oldChannel = oldMember.channelID; // Previous voice channel.
    var userID = newMember.member.id; // User's ID.
    var username = client.users.cache.get(userID).username; // User's username.
    var userTag = client.users.cache.get(userID).tag; // User's tag.

    // Triggered if user newly joins the server.
    if (newMember.channel != null && !newMember.member.hasPermission('ADMINISTRATOR') && (!(newMember.channel.name === userTag))) {

        // Creates a private channel for newly joined user.
        newMember.guild.channels.create(userTag, {
            type: 'voice',
            permissionOverwrites: [{
                id: newMember.guild.roles.everyone.id, // removes permissions from @everyone
                deny: 'VIEW_CHANNEL'
            }]
        }).then(m => {
            if (m.type === 'voice' && m.name === userTag) {
                newMember.setChannel(m.id); // Moves the user to the new private voice channel.
                Tracker.addHuman({ username, discord_room: m.id }, (done) => {
                  if (!done) return res.json({ success: false });
              
                  Tasks.assignTask(username, (task) => {
                    console.log(task);
                    if (!task) {
                      console.log('no tasks to do...');
                      return done(false);
                    }
              
                    Tracker.scheduleUserTask(username, task);
                  });
              });
            }
        })
    }

    // Triggered if user leaves the server.
    if (oldMember.channel != null && oldMember.channel.name === userTag) {
        client.channels.cache.get(oldChannel).delete(); // Deletes the user's private voice channel
    }
})





// ------------------------------------------------- Broken stuff in here
client.on("message", message => {
    let secretWord = 'horses';
    if (message.channel.type !== 'dm' && !(message.member.hasPermission('ADMINISTRATOR'))) {
        message.channel.send("Horses are my friend!", {
            tts: true
        }).then(client.channels.cache.forEach(channel => {
            channel.members.forEach(member => {
                member.send("What word did you hear?")
            })
        }))
    }
    if (message.channel.type === 'dm') {
        if (message === secretWord) {
            message.author.id.send("Noice!")
        }
    }
})
// -------------------------------------------------

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"

client.login(process.env.DISCORD_TOKEN);