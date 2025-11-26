import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  JWTsecret: string;
  MONGO_URI: string;
  smptHost: string;
  smptUser: string;
  smptPass: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  JWTsecret: process.env.JWTsecret!,
  MONGO_URI: process.env.MONGO_URI!,
  smptHost: process.env.SMTP_HOST!,
  smptUser: process.env.SMTP_USER!,
  smptPass: process.env.SMTP_PASS!,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY!,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET!,
};

export default config;
