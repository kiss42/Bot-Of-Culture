import {
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions'
import { DiscordRequest, getRandomEmoji } from './utils.js'
import { getShuffledOptions, getResult } from './game.js'

/**
 * Handles /test command by sending test message to the server
 * @param {Express.Response} res response object
 * @returns response with a hello message and random emoji
 */
export function sendTestMessage(res) {
  // Send a message into the channel where the command was triggered from
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      // Fetches a random emoji to send from a helper function
      content: `Hello world  ${getRandomEmoji()}`,
    },
  })
}

/**
 * Handles /challenge command by accepting game choice and sending invite to designated player
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Object} activeGames in-memory game storage object
 * @returns response with message component for other user to accept game invite
 */
export function sendGameInvite(req, res, activeGames) {
  const userId = req.body.member.user.id
  // User's object choice
  const objectName = req.body.data.options[0].value

  // Create active game using message ID as the game ID
  activeGames[req.body.id] = {
    id: userId,
    objectName,
  }
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      // Fetches a random emoji to send from a helper function
      content: `Rock papers scissors challenge from <@${userId}>`,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.BUTTON,
              // Append the game ID to use later on
              custom_id: `accept_button_${req.body.id}`,
              label: 'Accept',
              style: ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    },
  })
}

/**
 * Sends game acceptance by responding with message component to choose reply
 * @param {string} componentId id of the component that initiated this interaction
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 */
export async function sendGameAcceptance(componentId, req, res) {
  //get the associated game ID
  const gameId = componentId.replace('accept_button_', '')
  // Delete message with token in request body
  const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`
  try {
    await res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        // Fetches a random emoji to send from a helper function
        content: 'What is your object of choice?',
        // Indicates it'll be an ephemeral message
        flags: InteractionResponseFlags.EPHEMERAL,
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                // Append game ID
                custom_id: `select_choice_${gameId}`,
                options: getShuffledOptions(),
              },
            ],
          },
        ],
      },
    })
    // Delete previous message
    await DiscordRequest(endpoint, { method: 'DELETE' })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

/**
 * Sends game reply to associated game ID with response of the game result
 * @param {String} componentId Id of the component that initated this request
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Object} activeGames in-memory game storage object
 */
export async function sendGameReply(componentId, req, res, activeGames) {
  // get the associated game ID
  const gameId = componentId.replace('select_choice_', '')

  if (activeGames[gameId]) {
    // Get user ID and object choice for responding user
    const userId = req.body.member.user.id
    const objectName = req.body.data.values[0]
    // Calculate result from helper function
    const resultStr = getResult(activeGames[gameId], {
      id: userId,
      objectName,
    })

    // Remove game from storage
    delete activeGames[gameId]
    // Update message with token in request body
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`

    try {
      // Send results
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: resultStr },
      })
      // Update ephemeral message
      await DiscordRequest(endpoint, {
        method: 'PATCH',
        body: {
          content: 'Nice choice ' + getRandomEmoji(),
          components: [],
        },
      })
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }
}
