import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for localhost:3000 - localhost:3020
  app.enableCors({
    origin: Array.from({ length: 21 }, (_, i) => `http://localhost:${3000 + i}`),
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('PayMe API')
    .setDescription('API documentation for PayMe backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api`);
}
bootstrap();