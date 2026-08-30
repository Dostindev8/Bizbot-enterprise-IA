import { describe, it, expect } from 'vitest';
import { RegisterRequestSchema, LoginRequestSchema } from '@bizbot/shared-types';

describe('Auth & Validation Schemas', () => {
  it('validates a valid registration request', () => {
    const valid = {
      organizationName: 'Acme Enterprise Dominicana',
      adminName: 'Carlos Santana',
      email: 'carlos@acme.com',
      password: 'StrongPassword123!#',
      industry: 'Fintech',
    };

    const parsed = RegisterRequestSchema.parse(valid);
    expect(parsed.email).toBe('carlos@acme.com');
  });

  it('rejects weak passwords missing symbols or numbers', () => {
    const invalid = {
      organizationName: 'Acme Enterprise',
      adminName: 'Carlos',
      email: 'carlos@acme.com',
      password: 'weak',
    };

    expect(() => RegisterRequestSchema.parse(invalid)).toThrow();
  });

  it('validates login request payload', () => {
    const valid = {
      email: 'admin@bizbot.ai',
      password: 'SecretPassword2026!',
    };

    const parsed = LoginRequestSchema.parse(valid);
    expect(parsed.email).toBe('admin@bizbot.ai');
  });
});
