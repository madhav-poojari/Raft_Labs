import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';

import { AuthService } from './auth.service';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { AuthToken } from './entities/auth-token.entity';
import { PubSub } from 'graphql-subscriptions';
import { Alert } from 'src/users/entities/alert.entity';

@Resolver('auth')
export class AuthResolver {
  private pubSub: PubSub;
  constructor(private readonly authService: AuthService) {
    this.pubSub = new PubSub();
  }

  @Public()
  @Mutation(() => AuthToken, { name: 'signUp' })
  async signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    const user = this.authService.signUp(signUpInput);
    const alert = new Alert(); // Create an instance of the Alert class
    alert.from = 'server';
    alert.message = 'A New user has been created';
    this.pubSub.publish('Broadcast', { broadcastMessage: alert });
    return user;
  }

  @Public()
  @Mutation(() => AuthToken, { name: 'signIn' })
  async signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }
  @Public()
  @Subscription((returns) => Alert, {
    name: 'broadcastMessage',
  })
  subscribeToUserAdded() {
    return this.pubSub.asyncIterator('Broadcast');
  }

  @Mutation(() => User, { name: 'signOut', nullable: true })
  signOut(@ActiveUser('id') userId: string) {
    return this.authService.signOut(userId);
  }
}
