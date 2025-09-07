import { 
  users, projects, towers, units, leads, communications, customers, bookings, payments, channelPartners,
  type User, type InsertUser, type Project, type InsertProject, type Tower, type InsertTower,
  type Unit, type InsertUnit, type Lead, type InsertLead, type Communication, type InsertCommunication,
  type Customer, type InsertCustomer, type Booking, type InsertBooking, type Payment, type InsertPayment,
  type ChannelPartner, type InsertChannelPartner
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, like } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Project management
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: string): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;

  // Tower management
  createTower(tower: InsertTower): Promise<Tower>;
  getTowersByProject(projectId: string): Promise<Tower[]>;

  // Unit management
  createUnit(unit: InsertUnit): Promise<Unit>;
  getUnitsByProject(projectId: string): Promise<Unit[]>;
  getUnitsByTower(towerId: string): Promise<Unit[]>;
  updateUnitStatus(id: string, status: "available" | "reserved" | "sold" | "blocked"): Promise<Unit>;

  // Lead management
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: string): Promise<Lead | undefined>;
  getAllLeads(): Promise<Lead[]>;
  getLeadsByStatus(status: string): Promise<Lead[]>;
  getLeadsByAssignee(userId: string): Promise<Lead[]>;
  updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead>;
  searchLeads(query: string): Promise<Lead[]>;

  // Communication management
  createCommunication(communication: InsertCommunication): Promise<Communication>;
  getCommunicationsByLead(leadId: string): Promise<Communication[]>;
  getRecentCommunications(limit?: number): Promise<Communication[]>;

  // Customer management
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  getCustomersByAssignee(userId: string): Promise<Customer[]>;

  // Booking management
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByCustomer(customerId: string): Promise<Booking[]>;

  // Payment management
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByBooking(bookingId: string): Promise<Payment[]>;
  getPaymentsByCustomer(customerId: string): Promise<Payment[]>;

  // Channel Partner management
  createChannelPartner(partner: InsertChannelPartner): Promise<ChannelPartner>;
  getAllChannelPartners(): Promise<ChannelPartner[]>;
  updateChannelPartner(id: string, partner: Partial<InsertChannelPartner>): Promise<ChannelPartner>;

  // Analytics
  getDashboardMetrics(): Promise<{
    totalLeads: number;
    monthlyRevenue: string;
    conversionRate: number;
    activeProjects: number;
    leadsByStatus: { status: string; count: number }[];
    leadsBySource: { source: string; count: number }[];
    topPerformers: { userId: string; userName: string; sales: string; deals: number }[];
  }>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ pool, createTableIfMissing: true });
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(asc(users.firstName));
  }

  // Project management
  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project> {
    const [project] = await db.update(projects).set(updateData).where(eq(projects.id, id)).returning();
    return project;
  }

  // Tower management
  async createTower(insertTower: InsertTower): Promise<Tower> {
    const [tower] = await db.insert(towers).values(insertTower).returning();
    return tower;
  }

  async getTowersByProject(projectId: string): Promise<Tower[]> {
    return await db.select().from(towers).where(eq(towers.projectId, projectId));
  }

  // Unit management
  async createUnit(insertUnit: InsertUnit): Promise<Unit> {
    const [unit] = await db.insert(units).values(insertUnit).returning();
    return unit;
  }

  async getUnitsByProject(projectId: string): Promise<Unit[]> {
    return await db.select().from(units).where(eq(units.projectId, projectId));
  }

  async getUnitsByTower(towerId: string): Promise<Unit[]> {
    return await db.select().from(units).where(eq(units.towerId, towerId));
  }

  async updateUnitStatus(id: string, status: "available" | "reserved" | "sold" | "blocked"): Promise<Unit> {
    const [unit] = await db.update(units).set({ status }).where(eq(units.id, id)).returning();
    return unit;
  }

  // Lead management
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.status, status as any));
  }

  async getLeadsByAssignee(userId: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.assignedTo, userId));
  }

  async updateLead(id: string, updateData: Partial<InsertLead>): Promise<Lead> {
    const [lead] = await db.update(leads).set(updateData).where(eq(leads.id, id)).returning();
    return lead;
  }

  async searchLeads(query: string): Promise<Lead[]> {
    return await db.select().from(leads).where(
      sql`${leads.firstName} ILIKE ${`%${query}%`} OR ${leads.lastName} ILIKE ${`%${query}%`} OR ${leads.phone} ILIKE ${`%${query}%`} OR ${leads.email} ILIKE ${`%${query}%`}`
    );
  }

  // Communication management
  async createCommunication(insertCommunication: InsertCommunication): Promise<Communication> {
    const [communication] = await db.insert(communications).values(insertCommunication).returning();
    return communication;
  }

  async getCommunicationsByLead(leadId: string): Promise<Communication[]> {
    return await db.select().from(communications).where(eq(communications.leadId, leadId)).orderBy(desc(communications.createdAt));
  }

  async getRecentCommunications(limit: number = 10): Promise<Communication[]> {
    return await db.select().from(communications).orderBy(desc(communications.createdAt)).limit(limit);
  }

  // Customer management
  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db.insert(customers).values(insertCustomer).returning();
    return customer;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomersByAssignee(userId: string): Promise<Customer[]> {
    return await db.select().from(customers).where(eq(customers.assignedTo, userId));
  }

  // Booking management
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.customerId, customerId));
  }

  // Payment management
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async getPaymentsByBooking(bookingId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.bookingId, bookingId));
  }

  async getPaymentsByCustomer(customerId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.customerId, customerId));
  }

  // Channel Partner management
  async createChannelPartner(insertPartner: InsertChannelPartner): Promise<ChannelPartner> {
    const [partner] = await db.insert(channelPartners).values(insertPartner).returning();
    return partner;
  }

  async getAllChannelPartners(): Promise<ChannelPartner[]> {
    return await db.select().from(channelPartners).orderBy(desc(channelPartners.createdAt));
  }

  async updateChannelPartner(id: string, updateData: Partial<InsertChannelPartner>): Promise<ChannelPartner> {
    const [partner] = await db.update(channelPartners).set(updateData).where(eq(channelPartners.id, id)).returning();
    return partner;
  }

  // Analytics
  async getDashboardMetrics() {
    // Total leads
    const [{ count: totalLeads }] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(leads);

    // Monthly revenue (current month)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [{ revenue: monthlyRevenue }] = await db.select({ 
      revenue: sql`COALESCE(SUM(${payments.amount}), 0)`.mapWith(String) 
    }).from(payments).where(
      and(
        sql`EXTRACT(MONTH FROM ${payments.paidDate}) = ${currentMonth}`,
        sql`EXTRACT(YEAR FROM ${payments.paidDate}) = ${currentYear}`,
        eq(payments.status, "completed")
      )
    );

    // Conversion rate
    const [{ sold }] = await db.select({ sold: sql`count(*)`.mapWith(Number) }).from(leads).where(eq(leads.status, "sold"));
    const conversionRate = totalLeads > 0 ? Math.round((sold / totalLeads) * 100 * 10) / 10 : 0;

    // Active projects
    const [{ count: activeProjects }] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(projects).where(eq(projects.isActive, true));

    // Leads by status
    const leadsByStatusRaw = await db.select({
      status: leads.status,
      count: sql`count(*)`.mapWith(Number)
    }).from(leads).groupBy(leads.status);
    const leadsByStatus = leadsByStatusRaw.map(row => ({ 
      status: row.status || 'unknown', 
      count: row.count 
    }));

    // Leads by source
    const leadsBySource = await db.select({
      source: leads.source,
      count: sql`count(*)`.mapWith(Number)
    }).from(leads).groupBy(leads.source);

    // Top performers (users with most sales this month)
    const topPerformers = await db.select({
      userId: users.id,
      userName: sql`${users.firstName} || ' ' || ${users.lastName}`.mapWith(String),
      sales: sql`COALESCE(SUM(${payments.amount}), 0)`.mapWith(String),
      deals: sql`count(DISTINCT ${bookings.id})`.mapWith(Number)
    }).from(users)
      .leftJoin(bookings, eq(users.id, bookings.assignedTo))
      .leftJoin(payments, and(
        eq(payments.bookingId, bookings.id),
        eq(payments.status, "completed"),
        sql`EXTRACT(MONTH FROM ${payments.paidDate}) = ${currentMonth}`,
        sql`EXTRACT(YEAR FROM ${payments.paidDate}) = ${currentYear}`
      ))
      .groupBy(users.id, users.firstName, users.lastName)
      .orderBy(desc(sql`COALESCE(SUM(${payments.amount}), 0)`))
      .limit(5);

    return {
      totalLeads,
      monthlyRevenue,
      conversionRate,
      activeProjects,
      leadsByStatus,
      leadsBySource,
      topPerformers
    };
  }
}

export const storage = new DatabaseStorage();
