import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Habilita `vi` sem precisar importar
    environment: 'jsdom', // Necessário para testar componentes React
  },
});
