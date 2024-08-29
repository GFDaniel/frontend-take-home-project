const { defineConfig } = require('cypress');
const { initPlugin } = require('cypress-plugin-snapshots/plugin');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on:any, config:any) {
        initPlugin(on, config);
        return config;
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
  },
});
