import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ChatService } from './chat.service';
// import { Room } from './entities';
import { Public } from 'src/common/decorators/public.decorator';
import { Room } from './entities/room.entity';
import { Message } from './entities/message.entity';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
// import { Alert } from './entities/alert.entity';

@Resolver('chat')
export class ChatResolver {
  private pubSub: PubSub;
  constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub();
  }

  @Mutation(() => Room, {
    name: 'joinRoom',
  })
  async getRoom(
    @Args('roomId') roomId: string,
    @ActiveUser('id') userId: string,
  ) {
    // const room =new Room();
    console.log(roomId);
    console.log(userId);

    // return room;
    return this.chatService.joinRoom(roomId, userId);
  }

  @Mutation(() => String)
  async leaveRoom(
    @Args('roomId') roomId: string,
    @ActiveUser('id') userId: string,
  ): Promise<string> {
    // Implement the logic to remove the user from the room
    return this.chatService.leaveRoom(roomId, userId);
  }

  @Mutation(() => Message)
  async sendMessage(
    @Args('roomId') roomId: string,
    @Args('text') text: string,
    @ActiveUser('id') userId: string,
  ) {
    const { message, room } = this.chatService.sendMessage(
      roomId,
      text,
      userId,
    );
    console.log(message);
    this.pubSub.publish('chat', { chat: message, Room: room });
    return message;
  }
  @Public()
  @Subscription((returns) => Message, {
    name: 'chat',
    filter: (payload, variables) =>
      payload.chat.roomId === variables.roomId &&
      payload.Room.users.includes(variables.userId),
  })
  subscribeToChat(
    @Args('roomId') roomId: string,
    @Args('userId') userId: string,
  ) {
    return this.pubSub.asyncIterator('chat');
  }
}
