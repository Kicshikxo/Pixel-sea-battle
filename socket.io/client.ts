import { Socket, io } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '~/socket.io/types'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io()
