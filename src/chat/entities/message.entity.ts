import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Room Model' })
export class Message {
  roomId?: string;
  text?: string;
  userId?: string;
}
