'use strict';

// Production specific configuration
// =================================
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
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/webapp'
  },

  settings: {
    apiUrl: 'https://api.guanplus.com/api/',
    apiVersion: 'v1',
    baiduId: '7ebb09c2c1f9eb6c858bd80a7ce4e984',
    geeTestId: '6a23333205fa065b5867246820ecb583'
  }
};
