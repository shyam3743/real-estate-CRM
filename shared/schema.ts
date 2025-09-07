import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["master", "developer_hq", "sales_admin", "sales_executive"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "site_visit", "negotiation", "booking", "sold", "lost"]);
export const leadSourceEnum = pgEnum("lead_source", ["website", "referral", "social_media", "walk_in", "phone", "email", "advertisement"]);
export const communicationTypeEnum = pgEnum("communication_type", ["call", "email", "sms", "meeting", "site_visit"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "cancelled"]);
export const unitStatusEnum = pgEnum("unit_status", ["available", "reserved", "sold", "blocked"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: userRoleEnum("role").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  totalUnits: integer("total_units").notNull(),
  availableUnits: integer("available_units").notNull(),
  soldUnits: integer("sold_units").default(0),
  startingPrice: decimal("starting_price", { precision: 15, scale: 2 }),
  endingPrice: decimal("ending_price", { precision: 15, scale: 2 }),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Towers table
export const towers = pgTable("towers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  name: text("name").notNull(),
  totalFloors: integer("total_floors").notNull(),
  unitsPerFloor: integer("units_per_floor").notNull(),
  totalUnits: integer("total_units").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Units table
export const units = pgTable("units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  towerId: varchar("tower_id").notNull().references(() => towers.id),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  unitNumber: text("unit_number").notNull(),
  floor: integer("floor").notNull(),
  type: text("type").notNull(), // 1BHK, 2BHK, etc.
  area: decimal("area", { precision: 10, scale: 2 }).notNull(),
  price: decimal("price", { precision: 15, scale: 2 }).notNull(),
  status: unitStatusEnum("status").default("available"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leads table
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  source: leadSourceEnum("source").notNull(),
  status: leadStatusEnum("status").default("new"),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  requirements: text("requirements"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  projectInterest: varchar("project_interest").references(() => projects.id),
  unitInterest: varchar("unit_interest").references(() => units.id),
  notes: text("notes"),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Communications table
export const communications = pgTable("communications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: communicationTypeEnum("type").notNull(),
  subject: text("subject"),
  content: text("content"),
  duration: integer("duration"), // in minutes for calls/meetings
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  status: text("status").default("completed"), // completed, scheduled, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Customers table (converted leads)
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  address: text("address"),
  panNumber: text("pan_number"),
  aadharNumber: text("aadhar_number"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  unitId: varchar("unit_id").notNull().references(() => units.id),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 15, scale: 2 }).default("0"),
  balanceAmount: decimal("balance_amount", { precision: 15, scale: 2 }).notNull(),
  bookingDate: timestamp("booking_date").defaultNow(),
  expectedCompletionDate: timestamp("expected_completion_date"),
  status: text("status").default("active"), // active, completed, cancelled
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  transactionId: text("transaction_id"),
  status: paymentStatusEnum("status").default("pending"),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  receiptNumber: text("receipt_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Channel Partners table
export const channelPartners = pgTable("channel_partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  companyName: text("company_name"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("0"),
  totalLeads: integer("total_leads").default(0),
  totalSales: decimal("total_sales", { precision: 15, scale: 2 }).default("0"),
  totalCommission: decimal("total_commission", { precision: 15, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
  communications: many(communications),
  customers: many(customers),
  bookings: many(bookings),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  towers: many(towers),
  units: many(units),
  leads: many(leads),
  bookings: many(bookings),
}));

export const towersRelations = relations(towers, ({ one, many }) => ({
  project: one(projects, {
    fields: [towers.projectId],
    references: [projects.id],
  }),
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  tower: one(towers, {
    fields: [units.towerId],
    references: [towers.id],
  }),
  project: one(projects, {
    fields: [units.projectId],
    references: [projects.id],
  }),
  leads: many(leads),
  bookings: many(bookings),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  assignedUser: one(users, {
    fields: [leads.assignedTo],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [leads.projectInterest],
    references: [projects.id],
  }),
  unit: one(units, {
    fields: [leads.unitInterest],
    references: [units.id],
  }),
  communications: many(communications),
  customer: one(customers),
}));

export const communicationsRelations = relations(communications, ({ one }) => ({
  lead: one(leads, {
    fields: [communications.leadId],
    references: [leads.id],
  }),
  user: one(users, {
    fields: [communications.userId],
    references: [users.id],
  }),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  lead: one(leads, {
    fields: [customers.leadId],
    references: [leads.id],
  }),
  assignedUser: one(users, {
    fields: [customers.assignedTo],
    references: [users.id],
  }),
  bookings: many(bookings),
  payments: many(payments),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(customers, {
    fields: [bookings.customerId],
    references: [customers.id],
  }),
  unit: one(units, {
    fields: [bookings.unitId],
    references: [units.id],
  }),
  project: one(projects, {
    fields: [bookings.projectId],
    references: [projects.id],
  }),
  assignedUser: one(users, {
    fields: [bookings.assignedTo],
    references: [users.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
  customer: one(customers, {
    fields: [payments.customerId],
    references: [customers.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTowerSchema = createInsertSchema(towers).omit({
  id: true,
  createdAt: true,
});

export const insertUnitSchema = createInsertSchema(units).omit({
  id: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunicationSchema = createInsertSchema(communications).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertChannelPartnerSchema = createInsertSchema(channelPartners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Tower = typeof towers.$inferSelect;
export type InsertTower = z.infer<typeof insertTowerSchema>;
export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Communication = typeof communications.$inferSelect;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type ChannelPartner = typeof channelPartners.$inferSelect;
export type InsertChannelPartner = z.infer<typeof insertChannelPartnerSchema>;
