import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Room } from './entities';
import { Message } from './entities/message.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ChatService {
  private rooms: Room[] = [];
  private pubSub: PubSub = new PubSub();

  joinRoom(roomId: string, userId: string): Room {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) {
      const room = new Room();
      room.id = roomId;
      room.name = 'roomName -' + roomId;
      room.users = [];
      room.messages = [];
      room.users.push(userId);
      console.log(room);
      this.rooms.push(room);
      return room;
    }
    if (!room.users.includes(userId)) {
      room.users.push(userId);
    }
    return room;
  }
  leaveRoom(roomId: string, userId: string): string {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    console.log(room);
    room.users = room.users.filter((u) => u !== userId);
    return `Left the room- ${roomId}`;
  }
  sendMessage(roomId: string, text: string, userId: string) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    const message: Message = {
      roomId,
      text,
      userId,
    };
    const messages: Message[] = room.messages;
    messages.push(message);
    return { message, room };
  }
}
