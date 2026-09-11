import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    // `skills/` son bloques de conocimiento de terceros con sus propios
    // scripts .mjs; no son suites del proyecto y rompen el runner.
    exclude: [...configDefaults.exclude, 'skills/**'],
  },
});
