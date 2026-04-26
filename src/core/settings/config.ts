import * as dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || "",
  mongoUrl: process.env.MONGO_URL || "",
  dbName: process.env.DB_NAME || "",
  blogCollectionName: process.env.BLOG_COLLECTION_NAME || "",
  postCollectionName: process.env.POST_COLLECTION_NAME || "",
  userCollectionName: process.env.USER_COLLECTION_NAME || "",
  commentCollectionName: process.env.COMMENT_COLLECTION_NAME || "",
  tokenBlackListCollectionName:
    process.env.TOKEN_BLACK_LIST_COLLECTION_NAME || "",
  requestCollectionName: process.env.REQUEST_COLLECTION_NAME || "",
  deviceCollectionName: process.env.DEVICE_COLLECTION_NAME || "",
  adminUsername: process.env.ADMIN_USERNAME || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY || "",
  accessTokenExpireTime: process.env.ACCESS_TOKEN_EXPIRE_TIME || 60,
  refreshTokenExpireTime: process.env.REFRESH_TOKEN_EXPIRE_TIME || 60,
  emailAddress: process.env.EMAIL_ADDRESS || "",
  emailPassword: process.env.EMAIL_PASSWORD || "",
  smtpAddress: process.env.SMTP_ADDRESS || "",
  smtpPort: process.env.SMTP_PORT || 465,
  rateLimitInterval: process.env.RATE_LIMIT_INTERVAL || 10,
  rateLimitCount: process.env.RATE_LIMIT_COUNT || 5,
};

export default config;
