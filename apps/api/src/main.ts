import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  if (configService.get('app.nodeEnv', { infer: true }) === 'production') {
    const secrets = {
      AUTH_JWT_SECRET: configService.getOrThrow('auth.secret', { infer: true }),
      AUTH_REFRESH_SECRET: configService.getOrThrow('auth.refreshSecret', {
        infer: true,
      }),
      AUTH_FORGOT_SECRET: configService.getOrThrow('auth.forgotSecret', {
        infer: true,
      }),
      AUTH_CONFIRM_EMAIL_SECRET: configService.getOrThrow(
        'auth.confirmEmailSecret',
        { infer: true },
      ),
    };
    for (const [name, value] of Object.entries(secrets)) {
      if (value.startsWith('replace-with-strong-random-')) {
        throw new Error(
          `Production refused: ${name} is still the .env.example placeholder. Generate a strong random value (>=32 chars).`,
        );
      }
    }
  }

  app.use(helmet());

  const frontendDomain = configService.get('app.frontendDomain', {
    infer: true,
  });
  app.enableCors({
    origin: frontendDomain ? [frontendDomain] : true,
    credentials: true,
  });

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      schema: {
        example: 'en',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
