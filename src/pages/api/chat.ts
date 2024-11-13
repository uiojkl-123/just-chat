import { NextApiRequest } from 'next'

import { IMessage } from '@/types/chat'

import { NextApiResponseServerIO } from './socket/io'

import fs from 'fs'

const chatHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === 'POST') {
    // get message
    const message = JSON.parse(req.body) as IMessage

    // dispatch to channel "message"
    res.socket.server.io.emit('message', message)

    // write message to file
    writeNewMessage(`${message.user.name} ${message.date} ${message.content}`)

    // return message
    res.status(201).json(message)
  }
  if (req.method === 'GET') {
    // read messages from file
    fs.readFile('./.messages.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err)
      }
      if (!data) {
        return res.status(200).json([])
      }

      const messages = data
        .split('\n')
        .slice(0, -1)
        .map((message) => {
          const [name, date, ...content] = message.split(' ')
          return {
            user: {
              name,
            },
            date,
            content: content.join(' '),
          }
        })
      res.status(200).json(messages)
    })
  }
}

const writeNewMessage = (message: string) => {
  fs.appendFile('./.messages.txt', `${message}\n`, (err) => {
    if (err) {
      console.error(err)
    }
  })
}

export default chatHandler
