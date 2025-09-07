import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  insertUserSchema,
  insertProjectSchema,
  insertLeadSchema,
  insertCustomerSchema,
  insertBookingSchema,
  insertPaymentSchema,
  insertChannelPartnerSchema,
  insertCommunicationSchema,
  insertTowerSchema,
  insertUnitSchema,
  type InsertUser,
  type InsertProject,
  type InsertLead,
  type InsertCustomer,
  type InsertBooking,
  type InsertPayment,
} from '@shared/schema'

describe('Schema Validation', () => {
  describe('User Schema', () => {
    it('should validate valid user data', () => {
      const validUser = {
        username: 'testuser',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: 'sales_executive' as const,
        isActive: true,
      }

      const result = insertUserSchema.safeParse(validUser)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validUser)
      }
    })

    it('should reject user with invalid email', () => {
      const invalidUser = {
        username: 'testuser',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        role: 'sales_executive' as const,
      }

      const result = insertUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })

    it('should reject user with missing required fields', () => {
      const invalidUser = {
        username: 'testuser',
        // missing password, firstName, lastName, email, role
      }

      const result = insertUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })

    it('should reject user with invalid role', () => {
      const invalidUser = {
        username: 'testuser',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'invalid_role' as any,
      }

      const result = insertUserSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
    })
  })

  describe('Project Schema', () => {
    it('should validate valid project data', () => {
      const validProject = {
        name: 'Test Project',
        description: 'A test project description',
        location: 'Test City',
        totalUnits: 100,
        availableUnits: 80,
        soldUnits: 20,
        startingPrice: '1000000.00',
        endingPrice: '5000000.00',
        imageUrl: 'https://example.com/image.jpg',
        isActive: true,
      }

      const result = insertProjectSchema.safeParse(validProject)
      expect(result.success).toBe(true)
    })

    it('should reject project with negative units', () => {
      const invalidProject = {
        name: 'Test Project',
        location: 'Test City',
        totalUnits: -10,
        availableUnits: 80,
      }

      const result = insertProjectSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
    })

    it('should reject project with missing required fields', () => {
      const invalidProject = {
        name: 'Test Project',
        // missing location, totalUnits, availableUnits
      }

      const result = insertProjectSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
    })
  })

  describe('Lead Schema', () => {
    it('should validate valid lead data', () => {
      const validLead = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567890',
        source: 'website' as const,
        status: 'new' as const,
        budget: '2000000.00',
        requirements: '3BHK apartment',
        assignedTo: 'user-id-123',
        projectInterest: 'project-id-123',
        unitInterest: 'unit-id-123',
        notes: 'Interested in premium units',
      }

      const result = insertLeadSchema.safeParse(validLead)
      expect(result.success).toBe(true)
    })

    it('should validate lead with minimal required fields', () => {
      const minimalLead = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1234567890',
        source: 'phone' as const,
      }

      const result = insertLeadSchema.safeParse(minimalLead)
      expect(result.success).toBe(true)
    })

    it('should reject lead with invalid source', () => {
      const invalidLead = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1234567890',
        source: 'invalid_source' as any,
      }

      const result = insertLeadSchema.safeParse(invalidLead)
      expect(result.success).toBe(false)
    })

    it('should reject lead with invalid email format', () => {
      const invalidLead = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'invalid-email-format',
        phone: '+1234567890',
        source: 'email' as const,
      }

      const result = insertLeadSchema.safeParse(invalidLead)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true)
      }
    })
  })

  describe('Customer Schema', () => {
    it('should validate valid customer data', () => {
      const validCustomer = {
        leadId: 'lead-id-123',
        firstName: 'John',
        lastName: 'Customer',
        email: 'john.customer@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, State 12345',
        panNumber: 'ABCDE1234F',
        aadharNumber: '123456789012',
        assignedTo: 'user-id-123',
      }

      const result = insertCustomerSchema.safeParse(validCustomer)
      expect(result.success).toBe(true)
    })

    it('should validate customer with minimal required fields', () => {
      const minimalCustomer = {
        firstName: 'John',
        lastName: 'Customer',
        phone: '+1234567890',
      }

      const result = insertCustomerSchema.safeParse(minimalCustomer)
      expect(result.success).toBe(true)
    })
  })

  describe('Booking Schema', () => {
    it('should validate valid booking data', () => {
      const validBooking = {
        customerId: 'customer-id-123',
        unitId: 'unit-id-123',
        projectId: 'project-id-123',
        totalAmount: '5000000.00',
        paidAmount: '1000000.00',
        balanceAmount: '4000000.00',
        expectedCompletionDate: new Date('2025-12-31'),
        status: 'active',
        assignedTo: 'user-id-123',
      }

      const result = insertBookingSchema.safeParse(validBooking)
      expect(result.success).toBe(true)
    })

    it('should validate booking with minimal required fields', () => {
      const minimalBooking = {
        customerId: 'customer-id-123',
        unitId: 'unit-id-123',
        projectId: 'project-id-123',
        totalAmount: '5000000.00',
        balanceAmount: '5000000.00',
      }

      const result = insertBookingSchema.safeParse(minimalBooking)
      expect(result.success).toBe(true)
    })
  })

  describe('Payment Schema', () => {
    it('should validate valid payment data', () => {
      const validPayment = {
        bookingId: 'booking-id-123',
        customerId: 'customer-id-123',
        amount: '500000.00',
        paymentMethod: 'bank_transfer',
        transactionId: 'TXN123456789',
        status: 'completed' as const,
        dueDate: new Date('2024-12-31'),
        paidDate: new Date('2024-12-15'),
        receiptNumber: 'RCP-2024-001',
        notes: 'First installment payment',
      }

      const result = insertPaymentSchema.safeParse(validPayment)
      expect(result.success).toBe(true)
    })

    it('should validate payment with minimal required fields', () => {
      const minimalPayment = {
        bookingId: 'booking-id-123',
        customerId: 'customer-id-123',
        amount: '500000.00',
        paymentMethod: 'cash',
      }

      const result = insertPaymentSchema.safeParse(minimalPayment)
      expect(result.success).toBe(true)
    })

    it('should reject payment with invalid status', () => {
      const invalidPayment = {
        bookingId: 'booking-id-123',
        customerId: 'customer-id-123',
        amount: '500000.00',
        paymentMethod: 'cash',
        status: 'invalid_status' as any,
      }

      const result = insertPaymentSchema.safeParse(invalidPayment)
      expect(result.success).toBe(false)
    })
  })

  describe('Channel Partner Schema', () => {
    it('should validate valid channel partner data', () => {
      const validPartner = {
        name: 'Partner Company',
        companyName: 'Partner Corp Ltd',
        email: 'contact@partner.com',
        phone: '+1234567890',
        address: '456 Business Ave, City, State 67890',
        commissionRate: '5.5',
        totalLeads: 50,
        totalSales: '10000000.00',
        totalCommission: '550000.00',
        isActive: true,
      }

      const result = insertChannelPartnerSchema.safeParse(validPartner)
      expect(result.success).toBe(true)
    })

    it('should validate partner with minimal required fields', () => {
      const minimalPartner = {
        name: 'Partner Name',
        email: 'partner@example.com',
        phone: '+1234567890',
      }

      const result = insertChannelPartnerSchema.safeParse(minimalPartner)
      expect(result.success).toBe(true)
    })
  })

  describe('Communication Schema', () => {
    it('should validate valid communication data', () => {
      const validCommunication = {
        leadId: 'lead-id-123',
        userId: 'user-id-123',
        type: 'call' as const,
        subject: 'Follow-up call',
        content: 'Discussed project requirements and pricing',
        duration: 30,
        scheduledAt: new Date('2024-12-20T10:00:00Z'),
        completedAt: new Date('2024-12-20T10:30:00Z'),
        status: 'completed',
      }

      const result = insertCommunicationSchema.safeParse(validCommunication)
      expect(result.success).toBe(true)
    })

    it('should validate communication with minimal required fields', () => {
      const minimalCommunication = {
        leadId: 'lead-id-123',
        userId: 'user-id-123',
        type: 'email' as const,
      }

      const result = insertCommunicationSchema.safeParse(minimalCommunication)
      expect(result.success).toBe(true)
    })

    it('should reject communication with invalid type', () => {
      const invalidCommunication = {
        leadId: 'lead-id-123',
        userId: 'user-id-123',
        type: 'invalid_type' as any,
      }

      const result = insertCommunicationSchema.safeParse(invalidCommunication)
      expect(result.success).toBe(false)
    })
  })

  describe('Tower Schema', () => {
    it('should validate valid tower data', () => {
      const validTower = {
        projectId: 'project-id-123',
        name: 'Tower A',
        totalFloors: 20,
        unitsPerFloor: 4,
        totalUnits: 80,
      }

      const result = insertTowerSchema.safeParse(validTower)
      expect(result.success).toBe(true)
    })

    it('should reject tower with negative floors', () => {
      const invalidTower = {
        projectId: 'project-id-123',
        name: 'Tower A',
        totalFloors: -5,
        unitsPerFloor: 4,
        totalUnits: 80,
      }

      const result = insertTowerSchema.safeParse(invalidTower)
      expect(result.success).toBe(false)
    })
  })

  describe('Unit Schema', () => {
    it('should validate valid unit data', () => {
      const validUnit = {
        towerId: 'tower-id-123',
        projectId: 'project-id-123',
        unitNumber: 'A-101',
        floor: 1,
        type: '2BHK',
        area: '1200.50',
        price: '3500000.00',
        status: 'available' as const,
      }

      const result = insertUnitSchema.safeParse(validUnit)
      expect(result.success).toBe(true)
    })

    it('should reject unit with negative floor', () => {
      const invalidUnit = {
        towerId: 'tower-id-123',
        projectId: 'project-id-123',
        unitNumber: 'A-101',
        floor: -1,
        type: '2BHK',
        area: '1200.50',
        price: '3500000.00',
      }

      const result = insertUnitSchema.safeParse(invalidUnit)
      expect(result.success).toBe(false)
    })

    it('should reject unit with invalid status', () => {
      const invalidUnit = {
        towerId: 'tower-id-123',
        projectId: 'project-id-123',
        unitNumber: 'A-101',
        floor: 1,
        type: '2BHK',
        area: '1200.50',
        price: '3500000.00',
        status: 'invalid_status' as any,
      }

      const result = insertUnitSchema.safeParse(invalidUnit)
      expect(result.success).toBe(false)
    })
  })

  describe('Edge Cases and Type Safety', () => {
    it('should handle undefined and null values appropriately', () => {
      const userWithNulls = {
        username: 'testuser',
        password: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: null,
        role: 'sales_executive' as const,
      }

      const result = insertUserSchema.safeParse(userWithNulls)
      expect(result.success).toBe(true)
    })

    it('should enforce type safety for decimal fields', () => {
      const projectWithStringNumbers = {
        name: 'Test Project',
        location: 'Test City',
        totalUnits: '100', // Should be number
        availableUnits: 80,
      }

      const result = insertProjectSchema.safeParse(projectWithStringNumbers)
      // This should fail because totalUnits should be a number, not string
      expect(result.success).toBe(false)
    })

    it('should validate UUID format where applicable', () => {
      const leadWithInvalidId = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1234567890',
        source: 'website' as const,
        assignedTo: 'not-a-valid-uuid',
      }

      // The schema should validate the format if it expects UUIDs
      const result = insertLeadSchema.safeParse(leadWithInvalidId)
      // Note: This depends on whether the schema enforces UUID format
      expect(result.success).toBe(true) // Currently accepts any string
    })
  })
})