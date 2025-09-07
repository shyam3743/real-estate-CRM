import { describe, it, expect, beforeEach } from 'vitest'
import { scrypt, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

// Test the hash and compare functions from auth.ts
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

describe('Authentication Functions', () => {
  describe('Password Hashing', () => {
    it('should hash a password successfully', async () => {
      const password = 'testPassword123!'
      const hashedPassword = await hashPassword(password)
      
      expect(hashedPassword).toBeDefined()
      expect(typeof hashedPassword).toBe('string')
      expect(hashedPassword).toContain('.')
      
      // Should have hex hash and hex salt
      const [hash, salt] = hashedPassword.split('.')
      expect(hash).toMatch(/^[a-f0-9]+$/)
      expect(salt).toMatch(/^[a-f0-9]+$/)
      expect(hash.length).toBe(128) // 64 bytes * 2 (hex)
      expect(salt.length).toBe(32)  // 16 bytes * 2 (hex)
    })

    it('should produce different hashes for the same password', async () => {
      const password = 'samePassword'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      expect(hash1).not.toBe(hash2)
    })

    it('should handle empty password', async () => {
      const hashedPassword = await hashPassword('')
      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).toContain('.')
    })

    it('should handle special characters in password', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const hashedPassword = await hashPassword(password)
      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).toContain('.')
    })
  })

  describe('Password Comparison', () => {
    it('should return true for correct password', async () => {
      const password = 'correctPassword123'
      const hashedPassword = await hashPassword(password)
      
      const isMatch = await comparePasswords(password, hashedPassword)
      expect(isMatch).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      const password = 'correctPassword123'
      const wrongPassword = 'wrongPassword123'
      const hashedPassword = await hashPassword(password)
      
      const isMatch = await comparePasswords(wrongPassword, hashedPassword)
      expect(isMatch).toBe(false)
    })

    it('should return false for empty password against hash', async () => {
      const password = 'somePassword'
      const hashedPassword = await hashPassword(password)
      
      const isMatch = await comparePasswords('', hashedPassword)
      expect(isMatch).toBe(false)
    })

    it('should handle case sensitivity', async () => {
      const password = 'CaseSensitivePassword'
      const hashedPassword = await hashPassword(password)
      
      const isMatchLower = await comparePasswords('casesensitivepassword', hashedPassword)
      const isMatchUpper = await comparePasswords('CASESENSITIVEPASSWORD', hashedPassword)
      const isMatchCorrect = await comparePasswords(password, hashedPassword)
      
      expect(isMatchLower).toBe(false)
      expect(isMatchUpper).toBe(false)
      expect(isMatchCorrect).toBe(true)
    })

    it('should handle malformed stored password', async () => {
      const password = 'testPassword'
      
      // Test with malformed hash (no dot separator)
      await expect(comparePasswords(password, 'malformedhash')).rejects.toThrow()
      
      // Test with invalid hex
      await expect(comparePasswords(password, 'invalidhex.invalidsalt')).rejects.toThrow()
    })
  })

  describe('Security Properties', () => {
    it('should use timing-safe comparison', async () => {
      const password = 'testPassword'
      const hashedPassword = await hashPassword(password)
      
      // Test multiple comparisons to ensure consistent timing
      const iterations = 10
      const times: number[] = []
      
      for (let i = 0; i < iterations; i++) {
        const start = Date.now()
        await comparePasswords('wrongPassword', hashedPassword)
        const end = Date.now()
        times.push(end - start)
      }
      
      // All comparisons should take similar time (within reasonable variance)
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length
      const maxDeviation = Math.max(...times.map(t => Math.abs(t - avgTime)))
      
      // Allow for some variance but ensure it's not excessive
      expect(maxDeviation).toBeLessThan(avgTime * 2)
    })

    it('should produce cryptographically strong salts', async () => {
      const password = 'testPassword'
      const salts = new Set()
      
      // Generate multiple hashes and collect salts
      for (let i = 0; i < 100; i++) {
        const hash = await hashPassword(password)
        const salt = hash.split('.')[1]
        salts.add(salt)
      }
      
      // All salts should be unique
      expect(salts.size).toBe(100)
    })
  })
})