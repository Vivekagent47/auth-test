import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const options = new DocumentBuilder()
    .setTitle('Nest jwt starte')
    .setDescription('Jwt project started with nest js')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('jwt')
    .build();
  
  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const logger = app.get('NestWinston');
  app.useLogger(logger);

  /**
   * Validation pipe transform json body
   * to dto class & checks validity
   */
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT || 8800);
}
bootstrap();
