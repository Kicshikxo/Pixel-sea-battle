import { Socket, io } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '~~/types/socket.io'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({ autoConnect: false })
