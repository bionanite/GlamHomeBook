import {
  users,
  beauticians,
  services,
  bookings,
  reviews,
  type User,
  type UpsertUser,
  type Beautician,
  type InsertBeautician,
  type Service,
  type InsertService,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string, phone?: string): Promise<User | undefined>;
  
  // Beautician operations
  createBeautician(beautician: InsertBeautician): Promise<Beautician>;
  getBeautician(id: string): Promise<Beautician | undefined>;
  getBeauticianByUserId(userId: string): Promise<Beautician | undefined>;
  getAllBeauticians(): Promise<Beautician[]>;
  updateBeautician(id: string, data: Partial<InsertBeautician>): Promise<Beautician | undefined>;
  
  // Admin beautician operations
  getPendingBeauticians(): Promise<Beautician[]>;
  approveBeautician(id: string): Promise<Beautician | undefined>;
  rejectBeautician(id: string): Promise<void>;
  
  // Service operations
  createService(service: InsertService): Promise<Service>;
  getServicesByBeauticianId(beauticianId: string): Promise<Service[]>;
  updateService(id: string, data: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<void>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByCustomerId(customerId: string): Promise<Booking[]>;
  getBookingsByBeauticianId(beauticianId: string): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByBeauticianId(beauticianId: string): Promise<Review[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string, phone?: string): Promise<User | undefined> {
    const updateData: any = { role, updatedAt: new Date() };
    if (phone) {
      updateData.phone = phone;
    }
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Beautician operations
  async createBeautician(beauticianData: InsertBeautician): Promise<Beautician> {
    const [beautician] = await db
      .insert(beauticians)
      .values(beauticianData)
      .returning();
    return beautician;
  }

  async getBeautician(id: string): Promise<Beautician | undefined> {
    const [beautician] = await db
      .select()
      .from(beauticians)
      .where(eq(beauticians.id, id));
    return beautician;
  }

  async getBeauticianByUserId(userId: string): Promise<Beautician | undefined> {
    const [beautician] = await db
      .select()
      .from(beauticians)
      .where(eq(beauticians.userId, userId));
    return beautician;
  }

  async getAllBeauticians(): Promise<Beautician[]> {
    return await db
      .select()
      .from(beauticians)
      .where(eq(beauticians.isApproved, true))
      .orderBy(desc(beauticians.rating));
  }

  async updateBeautician(id: string, data: Partial<InsertBeautician>): Promise<Beautician | undefined> {
    const [beautician] = await db
      .update(beauticians)
      .set(data)
      .where(eq(beauticians.id, id))
      .returning();
    return beautician;
  }

  // Admin beautician operations
  async getPendingBeauticians(): Promise<Beautician[]> {
    return await db
      .select()
      .from(beauticians)
      .where(eq(beauticians.isApproved, false))
      .orderBy(desc(beauticians.createdAt));
  }

  async approveBeautician(id: string): Promise<Beautician | undefined> {
    const [beautician] = await db
      .update(beauticians)
      .set({ isApproved: true })
      .where(eq(beauticians.id, id))
      .returning();
    return beautician;
  }

  async rejectBeautician(id: string): Promise<void> {
    await db.delete(beauticians).where(eq(beauticians.id, id));
  }

  // Service operations
  async createService(serviceData: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(serviceData)
      .returning();
    return service;
  }

  async getServicesByBeauticianId(beauticianId: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.beauticianId, beauticianId));
  }

  async updateService(id: string, data: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set(data)
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Booking operations
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(bookingData)
      .returning();
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerId, customerId))
      .orderBy(desc(bookings.scheduledDate));
  }

  async getBookingsByBeauticianId(beauticianId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.beauticianId, beauticianId))
      .orderBy(desc(bookings.scheduledDate));
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Review operations
  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(reviewData)
      .returning();
    
    // Update beautician rating
    const beauticianReviews = await this.getReviewsByBeauticianId(reviewData.beauticianId);
    const avgRating = beauticianReviews.reduce((sum, r) => sum + r.rating, 0) / beauticianReviews.length;
    
    await db
      .update(beauticians)
      .set({
        rating: avgRating.toFixed(2),
        reviewCount: beauticianReviews.length,
      })
      .where(eq(beauticians.id, reviewData.beauticianId));
    
    return review;
  }

  async getReviewsByBeauticianId(beauticianId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.beauticianId, beauticianId))
      .orderBy(desc(reviews.createdAt));
  }
}

export const storage = new DatabaseStorage();
