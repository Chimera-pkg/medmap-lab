module.exports = {
    apps: [
      {
        name: 'hl7-frontend',
        script: 'dist/server.js',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };