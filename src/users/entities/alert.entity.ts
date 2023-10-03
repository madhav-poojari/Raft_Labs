import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Alert Model' })
export class Alert {
  from: string;
  message: string;
}
