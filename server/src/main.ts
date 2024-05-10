import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SECRET as string || 'my-secret',
      resave: false,
      saveUninitialized: false,
    })
  )

  const config = new DocumentBuilder()
    .setTitle('reservation')
    .setDescription('The reservation API description')
    .setVersion('1.0')
    .addTag('reservation')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
