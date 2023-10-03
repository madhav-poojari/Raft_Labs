import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Alert } from './entities/alert.entity';

@Resolver('users')
export class UsersResolver {
  private pubSub: PubSub;
  constructor(private readonly usersService: UsersService) {
    this.pubSub = new PubSub();
  }

  @Query(() => User, { name: 'getMe' })
  async getMe(@ActiveUser('id') userId: string) {
    const Aser = this.usersService.getMe(userId);

    return Aser;
  }

  @Query(() => [User], { name: 'getAll' })
  async getAll(): Promise<User[]> {
    const users = await this.usersService.getAll(); // Delegate to your service method

    if (!users) {
      throw new Error('Users not found'); // Throw an error if no users are found
    }

    return users;
  }
}
