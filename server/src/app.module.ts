import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationModule } from './reservation/reservation.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/reservation'),
    ReservationModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      debug: true,
      driver: ApolloDriver,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client/dist'),
      exclude: ['/api/(.*)', '/graphql/(.*)']
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
