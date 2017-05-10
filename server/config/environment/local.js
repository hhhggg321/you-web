'use strict';

// Local development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/webapp-dev'
  },

  seedDB: true,

  settings: {
    apiUrl: 'https://api-dev.chinacloudsites.cn/api/',
    apiVersion: 'v1',
    baiduId: '758cfdb65a4d7277d14d63d30538ed7c',
    geeTestId: '6a23333205fa065b5867246820ecb583'
  }
};
