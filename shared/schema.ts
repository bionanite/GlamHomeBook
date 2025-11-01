import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - integrated with Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: text("phone"),
  role: text("role"), // 'customer' or 'beautician' - set after first login
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const beauticians = pgTable("beauticians", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  bio: text("bio"),
  experience: text("experience").notNull(), // '1-2', '3-5', '6-10', '10+'
  startingPrice: integer("starting_price").notNull(),
  availability: text("availability").notNull().default('flexible'),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0'),
  reviewCount: integer("review_count").notNull().default(0),
  isApproved: boolean("is_approved").notNull().default(false),
  serviceAreas: text("service_areas").array().notNull(), // ['Dubai Marina', 'Jumeirah', ...]
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  beauticianId: varchar("beautician_id").notNull().references(() => beauticians.id),
  name: text("name").notNull(), // 'makeup', 'lashes', 'manicure', 'pedicure', 'nails'
  price: integer("price").notNull(),
  duration: integer("duration").notNull(), // minutes
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  beauticianId: varchar("beautician_id").notNull().references(() => beauticians.id),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default('pending'), // 'pending', 'confirmed', 'completed', 'cancelled'
  totalAmount: integer("total_amount").notNull(),
  platformFee: integer("platform_fee").notNull(), // commission for Kosmospace
  beauticianEarnings: integer("beautician_earnings").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  beauticianId: varchar("beautician_id").notNull().references(() => beauticians.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert Schemas
export const insertBeauticianSchema = createInsertSchema(beauticians).omit({
  id: true,
  rating: true,
  reviewCount: true,
  isApproved: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertBeautician = z.infer<typeof insertBeauticianSchema>;
export type Beautician = typeof beauticians.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
