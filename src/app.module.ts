import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entites/user.entity';
import { Todo } from './todo/entities/todo.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { SeederService } from './services/seeder/seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [config],
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || '123456789',
      database: process.env.POSTGRES_DB || 'tododb',
      entities: [User, Todo],
      synchronize: true,
    }),
    TodoModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    SeederService,
  ],
})
export class AppModule {
  constructor(
    private readonly seederService: SeederService,
    private readonly configService: ConfigService,
  ) {
    console.log(process.env.HOST, 'h');
  }

  async onModuleInit() {
    // console.log('seeding');
    // await this.seederService.seed(10000);
    console.log(
      this.configService.get<string>('JWT_SECRET'),
      this.configService.get<string>('POSTGRES_PASSWORD'),
      process.env.POSTGRES_PASSWORD,
    );
  }
}
