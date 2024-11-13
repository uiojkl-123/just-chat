// pages/api/socket/io.ts
import { Server as NetServer } from 'http'
import { Socket } from 'net'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'

import { ServerToClientEvents } from '@/types/socket'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO<ServerToClientEvents>
    }
  }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server as NetServer
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler
