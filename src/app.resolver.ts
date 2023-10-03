import { Query, Resolver } from '@nestjs/graphql';

import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Resolver('app')
export class AppResolver {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Query(() => String)
  getHello(): string {
    return this.appService.getHello();
  }
}
