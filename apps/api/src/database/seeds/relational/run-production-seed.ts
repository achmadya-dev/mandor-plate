import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';

async function runProductionSeed() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  try {
    await app.get(RoleSeedService).run();
    await app.get(StatusSeedService).run();

    const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
    if (Boolean(email) !== Boolean(password)) {
      throw new Error(
        'BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD must be set together.',
      );
    }

    if (email && password) {
      if (password.length < 12) {
        throw new Error(
          'BOOTSTRAP_ADMIN_PASSWORD must contain at least 12 characters.',
        );
      }
      await app.get(UserSeedService).bootstrapAdmin({
        email,
        password,
        firstName: process.env.BOOTSTRAP_ADMIN_FIRST_NAME?.trim() || 'System',
        lastName: process.env.BOOTSTRAP_ADMIN_LAST_NAME?.trim() || 'Admin',
      });
    }
  } finally {
    await app.close();
  }
}

void runProductionSeed().catch((error: unknown) => {
  console.error('Production seed failed.', error);
  process.exitCode = 1;
});
