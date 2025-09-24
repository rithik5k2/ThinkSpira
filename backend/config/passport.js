import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

export default function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists in database
          let user = await User.findOne({ googleId: profile.id });
          
          if (!user) {
            // Create new user
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              accessToken: accessToken,
            });
            await user.save();
          } else {
            // Update access token for existing user
            user.accessToken = accessToken;
            await user.save();
          }
          
          // Add accessToken to the profile for session storage
          const userProfile = {
            ...profile,
            accessToken: accessToken,
            _id: user._id
          };
          
          return done(null, userProfile);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
}