import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Room Model' })
export class Room {
  id: string;
  name: string;
  users: string[]; // Store user IDs
  messages: [];
}
