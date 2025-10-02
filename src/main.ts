import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // cors
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:8081',
      'http://localhost:8081',
      'https://api.cron-job.org'
    ],
    credentials: true,
  });
 
  console.log('✅ CORS enabled successfully');

  // body parser
  app.use(express.json());

  const port = process.env.PORT ?? 3000;
  const backendUrl = process.env.BACKEND_URL ?? `http://localhost:${port}`;
  await app.listen(port);
  console.log('✅ Application running in :', backendUrl);
}
bootstrap();
