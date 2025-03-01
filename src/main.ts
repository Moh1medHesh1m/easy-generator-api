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
    .setTitle('API Documentation')
    .setDescription('API documentation for authentication system')
    .setVersion('1.0')
    .addBearerAuth() // Enable JWT authentication
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
