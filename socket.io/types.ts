import type { Room, RoomMessage } from '@prisma/client'

export interface ServerToClientEvents {
  'room:chat:addMessage': (message: RoomMessage) => void
}

export interface ClientToServerEvents {
  connection: () => void
  disconnect: () => void

  'room:join': (
    data: { id: string },
    callback?: (response: { room: Room | null; messages: RoomMessage[] }) => void,
  ) => void
  'room:leave': (data: { id: string }, callback?: () => void) => void
  'room:chat:sendMessage': (
    data: { roomId: string; text: string },
    callback?: (message: RoomMessage) => void,
  ) => void
}
