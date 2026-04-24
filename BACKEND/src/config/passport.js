// src/config/passport.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

const {
  googleClientId,
  googleClientSecret,
  googleCallbackUrl,
} = require("./config");

if (!googleClientId || !googleClientSecret || !googleCallbackUrl) {
  console.warn(
    "⚠️ Google OAuth env vars missing; Google login will fail if used.",
  );
}

console.log("✅ Google Callback URL:", googleCallbackUrl);

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl,
    },
    // verify callback
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value;
        // find user by googleId or email
        let user = await User.findOne({ googleId: profile.id });
        if (!user && email) {
          user = await User.findOne({ email });
        }

        if (!user) {
          // create user
          user = await User.create({
            name: profile.displayName || "Google User",
            email: email || undefined,
            googleId: profile.id,
            authProvider: "google",
          });
        } else if (!user.googleId) {
          // link existing account with googleId
          user.googleId = profile.id;
          user.authProvider = "google";
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
