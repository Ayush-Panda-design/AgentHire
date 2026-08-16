import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export function initializePassport() {
  // Google OAuth is optional for the demo — only register the strategy when
  // both credentials are present. Email/password auth works without them.
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('ℹ️  Google OAuth skipped (GOOGLE_CLIENT_ID not set). Email/password auth still works.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        proxy: true,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'), null);
          }

          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              if (!user.avatarUrl && profile.photos?.[0]?.value) {
                user.avatarUrl = profile.photos[0].value;
              }
              await user.save();
            }
          } else {
            user = await User.create({
              name: profile.displayName,
              email,
              googleId: profile.id,
              avatarUrl: profile.photos?.[0]?.value || null,
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}
