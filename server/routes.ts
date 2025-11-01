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

  // Beautician service management routes
  // Get beautician's own services
  app.get('/api/beautician/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const beautician = await storage.getBeauticianByUserId(userId);
      
      if (!beautician) {
        return res.status(404).json({ message: "Beautician profile not found" });
      }

      const services = await storage.getServicesByBeauticianId(beautician.id);
      res.json(services);
    } catch (error) {
      console.error("Error fetching beautician services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Create a new service
  app.post('/api/beautician/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const beautician = await storage.getBeauticianByUserId(userId);
      
      if (!beautician) {
        return res.status(404).json({ message: "Beautician profile not found" });
      }

      // Validate price and duration are integers
      const price = Number(req.body.price);
      const duration = Number(req.body.duration);
      
      if (!Number.isInteger(price) || price <= 0) {
        return res.status(400).json({ message: "Price must be a positive integer" });
      }
      
      if (!Number.isInteger(duration) || duration <= 0) {
        return res.status(400).json({ message: "Duration must be a positive integer" });
      }

      const validationResult = insertServiceSchema.safeParse({
        beauticianId: beautician.id,
        name: req.body.name,
        price,
        duration
      });

      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid service data",
          errors: validationResult.error.errors 
        });
      }

      const service = await storage.createService(validationResult.data);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  // Update a service
  app.patch('/api/beautician/services/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const beautician = await storage.getBeauticianByUserId(userId);
      
      if (!beautician) {
        return res.status(404).json({ message: "Beautician profile not found" });
      }

      // Verify the service belongs to this beautician
      const services = await storage.getServicesByBeauticianId(beautician.id);
      const serviceExists = services.find(s => s.id === req.params.id);
      
      if (!serviceExists) {
        return res.status(403).json({ message: "You can only update your own services" });
      }

      // Validate and prepare update data
      const updateData: any = {};
      
      if (req.body.name !== undefined) {
        updateData.name = req.body.name;
      }
      
      if (req.body.price !== undefined) {
        const price = Number(req.body.price);
        if (!Number.isInteger(price) || price <= 0) {
          return res.status(400).json({ message: "Price must be a positive integer" });
        }
        updateData.price = price;
      }
      
      if (req.body.duration !== undefined) {
        const duration = Number(req.body.duration);
        if (!Number.isInteger(duration) || duration <= 0) {
          return res.status(400).json({ message: "Duration must be a positive integer" });
        }
        updateData.duration = duration;
      }

      const service = await storage.updateService(req.params.id, updateData);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  // Delete a service
  app.delete('/api/beautician/services/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const beautician = await storage.getBeauticianByUserId(userId);
      
      if (!beautician) {
        return res.status(404).json({ message: "Beautician profile not found" });
      }

      // Verify the service belongs to this beautician
      const services = await storage.getServicesByBeauticianId(beautician.id);
      const serviceExists = services.find(s => s.id === req.params.id);
      
      if (!serviceExists) {
        return res.status(403).json({ message: "You can only delete your own services" });
      }

      await storage.deleteService(req.params.id);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Admin routes - protected by isAuthenticated and admin role check
  const isAdmin = async (req: any, res: any, next: any) => {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (user?.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  };

  // Get all bookings (admin only)
  app.get('/api/admin/bookings', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get pending beautician applications (admin only)
  app.get('/api/admin/beauticians/pending', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const beauticians = await storage.getPendingBeauticians();
      res.json(beauticians);
    } catch (error) {
      console.error("Error fetching pending beauticians:", error);
      res.status(500).json({ message: "Failed to fetch pending beauticians" });
    }
  });

  // Approve beautician (admin only)
  app.post('/api/admin/beauticians/:id/approve', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const beautician = await storage.approveBeautician(req.params.id);
      if (!beautician) {
        return res.status(404).json({ message: "Beautician not found" });
      }
      res.json({ message: "Beautician approved", beautician });
    } catch (error) {
      console.error("Error approving beautician:", error);
      res.status(500).json({ message: "Failed to approve beautician" });
    }
  });

  // Reject beautician (admin only)
  app.post('/api/admin/beauticians/:id/reject', isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.rejectBeautician(req.params.id);
      res.json({ message: "Beautician application rejected" });
    } catch (error) {
      console.error("Error rejecting beautician:", error);
      res.status(500).json({ message: "Failed to reject beautician" });
    }
  });

  // Update booking status (admin only)
  app.patch('/api/admin/bookings/:id/status', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      }

      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ message: "Booking status updated", booking });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
