# terrible-meme-bot
A less serious Discord bot, powered by NodeJS and Discord.js

![Deploy](https://github.com/Alex-CD/terrible-meme-bot/workflows/Deploy/badge.svg)

## Features

- !play : Music playback of videos and playlists from YouTube, with queue management features.
- !v : Sound file playback (intended for memes).
- !russianroulette : Disconnect a random person from the channel.

## Setup

You can run this just like any other NodeJS project, but it needs these two items:

- A .env file for storing bot settings
- An audio folder, whose path is defined in .env

.env need to be in the directory **above** the folder that contains the contents of this repo. By default, the program also looks in the same folder for an audio storage directory.


### Prerequisites

You need NodeJS and NPM installed to run this bot.

If you're having having issues when installing Discord Opus audio, make sure you're on the latest NPM version.


You'll also need to obtain a bot token through [Discord Developer Portal](https://discordapp.com/developers/docs/intro).

### Installing locally (or deploying manually)

Once you've cloned this repo, create a .env file in the folder above, containing [these settings](https://gist.github.com/Alex-CD/b169aaf9c5f58b6c307f1810ba832e35) and an audio folder next to it.

Your folder should resemble this:

```
- .env
- audio
- terrible-meme-bot (contains this repo)
```


Then run


```
cd terrible-meme-bot (or whatever you've named it to)
npm install
npm start 

````


## Contributions

This project is open to contributions!
Please make sure your build runs locally and passes CI checks (if these are turned on) before you open a pull request.
Cheers!



