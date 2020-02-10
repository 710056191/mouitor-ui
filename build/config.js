const config = {
  pagesDir: 'src/pages',
  title: process.env.VUE_APP_TITLE || 'Vue Admin Template',
  commonChunks: ['chunk-vendors', 'chunk-element-ui', 'chunk-components'],
};

module.exports = config;
