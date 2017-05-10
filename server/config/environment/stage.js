'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/webapp-dev'
  },

  seedDB: true,

  settings: {
    apiUrl: 'https://api-stage.chinacloudsites.cn/api/',
    apiVersion: 'v1',
    baiduId: '758cfdb65a4d7277d14d63d30538ed7c',
    geeTestId: '6a23333205fa065b5867246820ecb583'
  }
};
