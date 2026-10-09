const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes,
} = require("discord.js");

require("dotenv").config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

const command = new SlashCommandBuilder()
    .setName("tomato")
    .setDescription("Throw a tomato at someone 🍅")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("Who gets tomato'd?")
            .setRequired(true)
    );

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function registerCommand() {
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: [command.toJSON()] }
    );

    console.log("🍅 /tomato registered!");
}

client.once("clientReady", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "tomato") {
        const user = interaction.options.getUser("user");

        await interaction.reply(
            `🍅 **${interaction.user} threw a tomato at ${user}!** SPLAT! 💥`
        );
    }
});

registerCommand()
    .then(() => client.login(process.env.TOKEN))
    .catch(console.error);
