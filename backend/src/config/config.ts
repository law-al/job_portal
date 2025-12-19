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
  googleClientId: string;
  googleClientSecret: string;
  AwsAccessKey: string;
  AwsSecretKey: string;
  AwsRegion: string;
  AwsBucketName: string;
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
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  AwsAccessKey: process.env.AWS_ACCESS_KEY!,
  AwsSecretKey: process.env.AWS_SECRET_KEY!,
  AwsRegion: process.env.AWS_REGION!,
  AwsBucketName: process.env.AWS_BUCKET_NAME!,
};

export default config;
