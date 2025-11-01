import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBeauticianSchema, insertServiceSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has a beautician profile
      let beauticianProfile = null;
      if (user.role === 'beautician') {
        beauticianProfile = await storage.getBeauticianByUserId(userId);
      }

      res.json({
        ...user,
        beauticianProfile,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Set user role (customer or beautician)
  app.post('/api/auth/set-role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role, phone } = req.body;

      if (!role || !['customer', 'beautician'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'customer' or 'beautician'" });
      }

      const user = await storage.updateUserRole(userId, role, phone);
      res.json(user);
    } catch (error) {
      console.error("Error setting user role:", error);
      res.status(500).json({ message: "Failed to set user role" });
    }
  });

  // Beautician onboarding
  app.post('/api/beauticians/onboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Set user role to beautician if not already set
      const user = await storage.getUser(userId);
      if (!user?.role) {
        await storage.updateUserRole(userId, 'beautician', req.body.phone);
      }

      // Validate beautician data
      const validation = insertBeauticianSchema.safeParse({
        ...req.body,
        userId,
      });

      if (!validation.success) {
        return res.status(400).json({
          message: fromZodError(validation.error).toString(),
        });
      }

      const beautician = await storage.createBeautician(validation.data);

      // Create services
      if (req.body.services && Array.isArray(req.body.services)) {
        for (const serviceName of req.body.services) {
          await storage.createService({
            beauticianId: beautician.id,
            name: serviceName,
            price: req.body.startingPrice,
            duration: 60, // default 60 minutes
          });
        }
      }

      res.json({ beautician, message: "Application submitted successfully" });
    } catch (error) {
      console.error("Error onboarding beautician:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // Get all beauticians
  app.get('/api/beauticians', async (req, res) => {
    try {
      const beauticians = await storage.getAllBeauticians();
      res.json(beauticians);
    } catch (error) {
      console.error("Error fetching beauticians:", error);
      res.status(500).json({ message: "Failed to fetch beauticians" });
    }
  });

  // Get beautician by ID with services
  app.get('/api/beauticians/:id', async (req, res) => {
    try {
      const beautician = await storage.getBeautician(req.params.id);
      if (!beautician) {
        return res.status(404).json({ message: "Beautician not found" });
      }

      const services = await storage.getServicesByBeauticianId(beautician.id);
      res.json({ ...beautician, services });
    } catch (error) {
      console.error("Error fetching beautician:", error);
      res.status(500).json({ message: "Failed to fetch beautician" });
    }
  });

  // Get customer bookings
  app.get('/api/bookings/customer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings = await storage.getBookingsByCustomerId(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching customer bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get beautician bookings
  app.get('/api/bookings/beautician', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const beautician = await storage.getBeauticianByUserId(userId);
      
      if (!beautician) {
        return res.status(404).json({ message: "Beautician profile not found" });
      }

      const bookings = await storage.getBookingsByBeauticianId(beautician.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching beautician bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
