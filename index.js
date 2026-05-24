require('dotenv').config();
const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const {
    joinVoiceChannel,
    VoiceConnectionStatus
} = require('@discordjs/voice');

const TOKEN = process.env.TOKEN;
const GUILD_ID = '1214379501543497829';
const CHANNEL_ID = '1214381966913441803';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

function connectToVoice() {
    const guild = client.guilds.cache.get(GUILD_ID);

    if (!guild) {
        console.log('Server not found');
        return;
    }

    const connection = joinVoiceChannel({
        channelId: CHANNEL_ID,
        guildId: GUILD_ID,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false
    });

    console.log('Bot joined the voice channel');

    connection.on('stateChange', (_, newState) => {
        if (newState.status === VoiceConnectionStatus.Disconnected) {
            console.log('Reconnecting...');
            setTimeout(connectToVoice, 5000);
        }
    });
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    connectToVoice();
});

client.login(TOKEN);