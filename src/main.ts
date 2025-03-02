import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'aws-sdk';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { logger } from './modules/utils/services/winston.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });

  // add prefix /api to url
  app.setGlobalPrefix('api');

  // Setup Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('Easy Generator API')
    .setDescription('API documentation for Easy Generator')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description:
          'Enter **only** the token here. Do not include "Bearer ..." prefix.',
      },
      'access-token', // Name for the security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, document); // Swagger available at /api/docs

  // enable CORS
  app.enableCors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    origin: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters();

  // get the PORT
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('server.port');
  // update aws config
  config.update({
    accessKeyId: configService.get('aws.accessKeyId'),
    secretAccessKey: configService.get('aws.secretAccessKey'),
    region: configService.get('aws.region'),
  });

  // listen to the PORT
  await app.listen(port);

  console.log(`On http://127.0.0.1:${port}`);
  console.log(`Swagger Docs available at http://127.0.0.1:${port}/api/docs`);
}
bootstrap();
