const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript path aliases
const projectRoot = __dirname;
const watchFolders = [projectRoot];

config.projectRoot = projectRoot;
config.watchFolders = watchFolders;

// Configure path aliases resolution
config.resolver = {
  ...config.resolver,
  alias: {
    '@': path.resolve(projectRoot, 'src'),
  },
};

module.exports = config;
