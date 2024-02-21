import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Using ConfigService to centralize the configuration
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('API_PREFIX', 'api'));

  const config = new DocumentBuilder()
    .setTitle('IDP System API')
    .setDescription('The IDP System API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Using ConfigService to get PORT
  await app.listen(3000);
}
bootstrap();
