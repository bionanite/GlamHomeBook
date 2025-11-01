import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBeauticianSchema, insertServiceSchema, insertBookingSchema, insertReviewSchema, insertCustomerPreferencesSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import Stripe from "stripe";
import { OfferService } from "./services/offers";
import { triggerManualOfferGeneration } from "./scheduler";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Admin middleware - checks if user has admin role
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

  // Get all users (admin only) - for offer sending
  app.get('/api/users', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const allCustomers = await storage.getAllCustomers();
      res.json(allCustomers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
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

  // Get all beauticians with user names
  app.get('/api/beauticians', async (req, res) => {
    try {
      const beauticians = await storage.getAllBeauticians();
      
      // Enrich with user names
      const enrichedBeauticians = await Promise.all(
        beauticians.map(async (beautician) => {
          const user = await storage.getUser(beautician.userId);
          return {
            ...beautician,
            name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          };
        })
      );
      
      res.json(enrichedBeauticians);
    } catch (error) {
      console.error("Error fetching beauticians:", error);
      res.status(500).json({ message: "Failed to fetch beauticians" });
    }
  });

  // Get beautician by ID with services and user info
  app.get('/api/beauticians/:id', async (req, res) => {
    try {
      const beautician = await storage.getBeautician(req.params.id);
      if (!beautician) {
        return res.status(404).json({ message: "Beautician not found" });
      }

      const services = await storage.getServicesByBeauticianId(beautician.id);
      const user = await storage.getUser(beautician.userId);
      
      res.json({ 
        ...beautician, 
        services,
        name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      });
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

  // Booking routes
  // Create a new booking
  app.post('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { beauticianId, serviceId, scheduledDate, location, notes } = req.body;

      // Get service details for pricing
      const service = await storage.getService(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      // Calculate amounts (10% platform fee)
      const totalAmount = service.price;
      const platformFee = Math.round(totalAmount * 0.1);
      const beauticianEarnings = totalAmount - platformFee;

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, // Convert AED to fils (cents)
        currency: "aed",
        metadata: {
          customerId: userId,
          beauticianId,
          serviceId,
        },
      });

      // Create booking
      const booking = await storage.createBooking({
        customerId: userId,
        beauticianId,
        serviceId,
        scheduledDate: new Date(scheduledDate),
        location,
        status: 'pending',
        totalAmount,
        platformFee,
        beauticianEarnings,
        stripePaymentIntentId: paymentIntent.id,
      });

      res.status(201).json({
        booking,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get customer bookings
  app.get('/api/bookings/customer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookingsData = await storage.getBookingsByCustomerId(userId);
      
      // Enrich bookings with related data
      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking) => {
          const service = await storage.getService(booking.serviceId);
          const beautician = await storage.getBeautician(booking.beauticianId);
          const user = beautician ? await storage.getUser(beautician.userId) : null;
          const review = await storage.getReviewByBookingId(booking.id);
          
          return {
            ...booking,
            serviceName: service?.name || 'Unknown Service',
            beauticianName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
            hasReview: !!review,
          };
        })
      );
      
      res.json(enrichedBookings);
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

      const bookingsData = await storage.getBookingsByBeauticianId(beautician.id);
      
      // Enrich bookings with related data
      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking) => {
          const service = await storage.getService(booking.serviceId);
          const customer = await storage.getUser(booking.customerId);
          
          return {
            ...booking,
            serviceName: service?.name || 'Unknown Service',
            customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown',
          };
        })
      );
      
      res.json(enrichedBookings);
    } catch (error) {
      console.error("Error fetching beautician bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Cancel a booking
  app.patch('/api/bookings/:id/cancel', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const booking = await storage.getBooking(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Verify user owns this booking
      if (booking.customerId !== userId) {
        return res.status(403).json({ message: "You can only cancel your own bookings" });
      }

      // Only allow cancellation of pending bookings
      if (booking.status !== 'pending') {
        return res.status(400).json({ message: "Only pending bookings can be cancelled" });
      }

      const cancelledBooking = await storage.cancelBooking(req.params.id);
      res.json(cancelledBooking);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  });

  // Review routes
  // Create a review
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bookingId, rating, comment } = req.body;

      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      // Verify booking exists and belongs to user
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.customerId !== userId) {
        return res.status(403).json({ message: "You can only review your own bookings" });
      }

      // Check if review already exists
      const existingReview = await storage.getReviewByBookingId(bookingId);
      if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this booking" });
      }

      // Create review
      const review = await storage.createReview({
        bookingId,
        customerId: userId,
        beauticianId: booking.beauticianId,
        rating,
        comment: comment || null,
      });

      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Get reviews for a beautician
  app.get('/api/beauticians/:id/reviews', async (req, res) => {
    try {
      const reviewsData = await storage.getReviewsByBeauticianId(req.params.id);
      
      // Enrich reviews with customer names
      const enrichedReviews = await Promise.all(
        reviewsData.map(async (review) => {
          const customer = await storage.getUser(review.customerId);
          return {
            ...review,
            customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Anonymous',
          };
        })
      );
      
      res.json(enrichedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

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

  // WhatsApp Notification & Offer Endpoints

  // Get customer notification preferences
  app.get('/api/notifications/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const prefs = await storage.getCustomerPreferences(userId);
      
      if (!prefs) {
        // Return default preferences if none exist
        const user = await storage.getUser(userId);
        return res.json({
          customerId: userId,
          whatsappNumber: user?.phone || null,
          whatsappOptIn: true,
          receiveOffers: true,
          receiveReminders: true,
          preferredContactTime: 'morning',
        });
      }
      
      res.json(prefs);
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // Update customer notification preferences
  app.put('/api/notifications/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const parseResult = insertCustomerPreferencesSchema.safeParse({
        ...req.body,
        customerId: userId,
      });
      
      if (!parseResult.success) {
        return res.status(400).json({
          message: "Invalid preferences data",
          errors: fromZodError(parseResult.error).toString(),
        });
      }

      // Check if preferences exist
      const existing = await storage.getCustomerPreferences(userId);
      
      let prefs;
      if (existing) {
        // Update existing
        prefs = await storage.updateCustomerPreferences(userId, req.body);
      } else {
        // Create new
        prefs = await storage.createCustomerPreferences({
          ...req.body,
          customerId: userId,
        });
      }
      
      res.json(prefs);
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Send personalized offer to a customer (admin only)
  app.post('/api/offers/send', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { customerId } = req.body;
      
      if (!customerId) {
        return res.status(400).json({ message: "Customer ID is required" });
      }

      const offerService = new OfferService(storage);
      const result = await offerService.generateAndSendOffer(customerId);
      
      if (result.success) {
        res.json({ message: result.message });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error) {
      console.error("Error sending offer:", error);
      res.status(500).json({ message: "Failed to send offer" });
    }
  });

  // Trigger manual offer generation for all eligible customers (admin only)
  app.post('/api/offers/trigger-automated', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const result = await triggerManualOfferGeneration();
      res.json({
        message: `Automated offer generation completed`,
        sent: result.sent,
        failed: result.failed,
      });
    } catch (error) {
      console.error("Error triggering automated offers:", error);
      res.status(500).json({ message: "Failed to trigger automated offers" });
    }
  });

  // Get customer offers
  app.get('/api/offers/customer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const offers = await storage.getOffersByCustomerId(userId);
      res.json(offers);
    } catch (error) {
      console.error("Error fetching customer offers:", error);
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  // Track offer click
  app.post('/api/offers/:id/click', isAuthenticated, async (req, res) => {
    try {
      const offer = await storage.updateOfferStatus(req.params.id, 'clicked');
      res.json(offer);
    } catch (error) {
      console.error("Error tracking offer click:", error);
      res.status(500).json({ message: "Failed to track offer click" });
    }
  });

  // Ultramessage webhook (for delivery status)
  app.post('/api/webhooks/ultramessage', async (req, res) => {
    try {
      // Ultramessage sends delivery status updates
      console.log('Ultramessage webhook received:', req.body);
      // You can add logic here to update message status based on delivery reports
      res.json({ success: true });
    } catch (error) {
      console.error("Error processing Ultramessage webhook:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
