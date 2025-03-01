export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  mongo: {
    uri: process.env.MONGODB_URI,
  },
  mongotest: {
    uri: process.env.MONGODB_URI_TEST,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    salt: process.env.HASH_SALT,
  },
  urls: {
    frontend: process.env.FRONTEND_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    userCache : 3600
  },
  aws: {
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    bucketName: process.env.S3_BUCKET,
  },
});
