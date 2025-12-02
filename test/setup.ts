import { rm } from 'fs/promises';
import { join } from 'path';
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {
    console.log('No test.sqlite to remove', err);
  }
});
