import passport from 'passport';
import strategy from 'passport-google-oauth20';
import config from '../config/config.js';
import { prisma } from '../utils/prismaClient.js';

const GoogleStrategy = strategy.Strategy;
const GOOGLE_CALLBACK_URL = 'http://localhost:5000/api/v1/auth/google/callback';

/*passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return cb(new Error('No email provided by Google'), false);
        }

        const user = await prisma.user.upsert({
          where: {
            email,
          },
          update: {
            googleId: profile.id,
            isEmailVerified: true,
            isActive: true,
          },
          create: {
            googleId: profile.id,
            email,
            isEmailVerified: true,
            isActive: true,
          },
        });

        return cb(null, user);
      } catch (error) {
        return cb(error, false);
      }
    },
  ),
);

*/
