import { RoomStatus, RoomType, type Room, type RoomPlayer, type User } from '@prisma/client'
import { defineStore } from 'pinia'
import useSocketStore from '~/store/socket'

export default defineStore('rooms', () => {
  const { socket } = useSocketStore()
  const { session } = useAuth()

  const rooms = ref<(Room & { players: (RoomPlayer & { user: User })[] })[]>([])

  const activeRooms = computed(() =>
    rooms.value.filter(
      (room) =>
        (room.players.some((player) => player.userId === session.data.value?.id) ||
          room.creatorId === session.data.value?.id) &&
        room.status !== RoomStatus.FINISHED,
    ),
  )
  const publicRooms = computed(() =>
    rooms.value.filter(
      (room) =>
        room.type === RoomType.PUBLIC &&
        room.players.length < 2 &&
        activeRooms.value.every((activeRoom) => activeRoom.id !== room.id),
    ),
  )

  async function getRooms() {
    await new Promise<void>((resolve) =>
      socket.emit('rooms:list', undefined, (response) => {
        rooms.value = response ?? []
        resolve()
      }),
    )
  }

  socket.on('rooms:updateRoom', (updatedRoom) => {
    const index = rooms.value.findIndex((room) => room.id === updatedRoom.id)

    if (index !== -1) {
      rooms.value[index] = updatedRoom
    } else {
      rooms.value.push(updatedRoom)
    }
  })

  watchEffect(() => {
    if (session.status.value === 'unauthenticated') {
      rooms.value = []
    }
  })

  return { activeRooms, publicRooms, getRooms }
})
