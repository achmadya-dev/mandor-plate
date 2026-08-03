import 'dotenv/config';
import { AppDataSource } from './data-source';

async function runMigrations() {
  await AppDataSource.initialize();
  try {
    const migrations = await AppDataSource.runMigrations({
      transaction: 'all',
    });
    console.log(`Applied ${migrations.length} migration(s).`);
  } finally {
    await AppDataSource.destroy();
  }
}

void runMigrations().catch((error: unknown) => {
  console.error('Migration failed.', error);
  process.exitCode = 1;
});
