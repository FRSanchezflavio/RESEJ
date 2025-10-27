/**
 * Tests Unitarios: Utilidades y Validadores
 */

const {
  hashPassword,
  comparePassword,
  sanitizeObject,
  formatUsuario
} = require('../src/utils/helpers');

const validators = require('../src/utils/validators');

// ============================================================================
// Tests: Validadores con Express-Validator
// ============================================================================

describe('Validadores con Express-Validator', () => {
  
  describe('Handles de Validación', () => {
    test('Debe exportar manejador de errores de validación', () => {
      expect(validators.handleValidationErrors).toBeDefined();
      expect(typeof validators.handleValidationErrors).toBe('function');
    });

    test('Debe exportar validadores de login', () => {
      expect(validators.loginValidators).toBeDefined();
      expect(Array.isArray(validators.loginValidators)).toBe(true);
    });

    test('Debe exportar validadores de creación de usuario', () => {
      expect(validators.createUsuarioValidators).toBeDefined();
      expect(Array.isArray(validators.createUsuarioValidators)).toBe(true);
    });
  });

});

// ============================================================================
// Tests: Helpers (Criptografía)
// ============================================================================

describe('Helpers - Criptografía', () => {

  describe('hashPassword', () => {
    test('Debe generar hash válido', async () => {
      const password = 'MiContraseña_123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    test('Mismo password genera diferentes hashes', async () => {
      const password = 'MiContraseña_123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    test('Debe manejar passwords largos', async () => {
      const longPassword = 'a'.repeat(100);
      const hash = await hashPassword(longPassword);
      expect(hash).toBeDefined();
    });
  });

  describe('comparePassword', () => {
    test('Debe coincidir password correcto con hash', async () => {
      const password = 'MiContraseña_123';
      const hash = await hashPassword(password);
      const esValido = await comparePassword(password, hash);
      
      expect(esValido).toBe(true);
    });

    test('Debe rechazar password incorrecto', async () => {
      const password = 'MiContraseña_123';
      const otraPassword = 'OtraContraseña_456';
      const hash = await hashPassword(password);
      const esValido = await comparePassword(otraPassword, hash);
      
      expect(esValido).toBe(false);
    });

    test('Debe ser case-sensitive', async () => {
      const password = 'MiContraseña_123';
      const hash = await hashPassword(password);
      const esValido = await comparePassword('micontraseña_123', hash);
      
      expect(esValido).toBe(false);
    });
  });

  describe('sanitizeObject', () => {
    test('Debe remover campos sensibles por defecto', () => {
      const usuario = {
        id: 1,
        nombre: 'Juan',
        password: 'secreto',
        password_hash: 'hash123'
      };

      const sanitizado = sanitizeObject(usuario);
      
      expect(sanitizado.id).toBe(1);
      expect(sanitizado.nombre).toBe('Juan');
      expect(sanitizado.password).toBeUndefined();
      expect(sanitizado.password_hash).toBeUndefined();
    });

    test('Debe remover campos específicos', () => {
      const objeto = {
        id: 1,
        nombre: 'Test',
        token: 'secreto',
        apiKey: 'key123'
      };

      const sanitizado = sanitizeObject(objeto, ['token', 'apiKey']);
      
      expect(sanitizado.id).toBe(1);
      expect(sanitizado.nombre).toBe('Test');
      expect(sanitizado.token).toBeUndefined();
      expect(sanitizado.apiKey).toBeUndefined();
    });

    test('No debe mutar objeto original', () => {
      const original = { id: 1, password: 'secreto' };
      sanitizeObject(original);
      
      expect(original.password).toBe('secreto');
    });
  });

  describe('formatUsuario', () => {
    test('Debe formatear usuario correctamente', () => {
      const usuario = {
        id: 1,
        usuario: 'juan.perez',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        rol: 'admin',
        password_hash: 'hash123'
      };

      const formateado = formatUsuario(usuario);
      
      expect(formateado.id).toBe(1);
      expect(formateado.usuario).toBe('juan.perez');
      expect(formateado.nombre).toBe('Juan');
      expect(formateado.password_hash).toBeUndefined();
    });
  });

});
