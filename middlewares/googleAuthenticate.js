import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { User } from '../models/user.js';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL } = process.env;

const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/api/auth/google/callback`,
  passReqToCallback: true,
};

const googleCallBack = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done,
) => {
  try {
    const { email, displayName } = profile;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return done(null, user);
    }

    const password = await bcrypt.hash(nanoid(), 10);
    const newUser = await User.create({
      email,
      password,
      verify: true,
      name: displayName,
    });

    done(null, newUser);
  } catch (error) {
    done(error, false);
  }
};

const googleStrategy = new GoogleStrategy(googleParams, googleCallBack);

// Серіалізація та десеріалізація користувача для збереження його у сесії
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

export const pass = passport.use('google', googleStrategy);
