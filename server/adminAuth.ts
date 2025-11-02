import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import type { Express } from "express";
import { storage } from "./storage";

export function setupAdminAuth(app: Express) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const users = await storage.getAllUsers();
          const user = users.find(u => u.email === email);

          if (!user) {
            console.log(`Admin login failed: User not found for email ${email}`);
            return done(null, false, { message: "Invalid email or password" });
          }

          if (user.role !== "admin") {
            console.log(`Admin login failed: User ${email} is not an admin (role: ${user.role})`);
            return done(null, false, { message: "Admin access required" });
          }

          if (!user.passwordHash) {
            console.log(`Admin login failed: No password set for admin user ${email}`);
            return done(null, false, { message: "Invalid email or password" });
          }

          const isValidPassword = await bcrypt.compare(password, user.passwordHash);

          if (!isValidPassword) {
            console.log(`Admin login failed: Invalid password for ${email}`);
            return done(null, false, { message: "Invalid email or password" });
          }

          console.log(`Admin login successful: ${email}`);
          return done(null, user);
        } catch (error) {
          console.error("Error during admin authentication:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
