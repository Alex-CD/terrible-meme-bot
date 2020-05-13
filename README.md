# terrible-meme-bot
A less serious Discord bot, powered by NodeJS and Discord.js

![Build](https://api.travis-ci.org/Alex-CD/terrible-meme-bot.svg?branch=master)
![Deploy](https://github.com/Alex-CD/terrible-meme-bot/workflows/Deploy/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/e6541edbf92bbba970ea/maintainability)](https://codeclimate.com/github/Alex-CD/terrible-meme-bot/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e6541edbf92bbba970ea/test_coverage)](https://codeclimate.com/github/Alex-CD/terrible-meme-bot/test_coverage)



## Features

- !play : Music playback of videos and playlists from YouTube, with queue management features.
- !v : Sound file playback (intended for memes).
- !russianroulette : Disconnect a random person from the channel.

## Setup

You can run this just like any other NodeJS project, but it needs these two items:

- A .env file for storing bot settings
- An audio folder, whose path is defined in .env. This will default to the proejct folder.


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

and your .env should look something like this:

```
PROCESS_TITLE=terrible_meme_bot
LOCAL_AUDIO_DIR=../audio
DISCORD_TOKEN=[YOUR TOKEN HERE]
DEFAULT_COMMAND_PREFIX=!
DEFAULT_BOT_TIMEOUT_MINUTES=10
```

Then run


```
cd terrible-meme-bot (or whatever you've named it to)
npm install
npm start 

````


## Contributions

This project is open to contributions!
Please make sure your build runs locally, has no linting errors, passes CI checks  before you open a pull request.

Cheers!



