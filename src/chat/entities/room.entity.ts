import { ObjectType } from '@nestjs/graphql';
import { Message } from './message.entity';

@ObjectType({ description: 'Room Model' })
export class Room {
  id: string;
  name: string;
  users: string[]; // Store user IDs
  messages?: Message[];
}
