import express from 'express'
import { InteractionType, InteractionResponseType } from 'discord-interactions'
import { VerifyDiscordRequest } from './utils.js'
import { TEST_COMMAND, HasGuildCommands } from './commands.js'
import dotenv from 'dotenv'
import { sendGameAcceptance, sendGameInvite, sendGameReply, sendTestMessage } from './interactions.js'

// Env variables activate!
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }))

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {}

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * This uses legacy, or non-DiscordJS interactions and only commands using discord-interactions package
 * As a result, all interactions are handled through traditional HTTP routes instead of functional calls
 */
app.post('/interactions', async (req, res) => {
  // Interaction type and data
  const { type, id, data } = req.body

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG })
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data
    // "test" guild command
    if (name === 'test') {
      return sendTestMessage(res)
    }

    if (name === 'challenge' && id) {
      return sendGameInvite(req, res, activeGames)
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message componant
    const componentId = data.custom_id

    if (componentId.startsWith('accept_button_')) {
      return await sendGameAcceptance(componentId, req, res)
    } else if (componentId.startsWith('select_choice_')) {
      return await sendGameReply(componentId, req, res, activeGames)
    }
  }
})

app.listen(PORT, () => {
  console.log('Listening on port', PORT)

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [TEST_COMMAND])
})
