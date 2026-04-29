import { describe, it, expect } from 'vitest';

describe('Ejemplo de Prueba Unitatria', () => {
  it('debería sumar dos números correctamente', () => {
    const suma = (a: number, b: number) => a + b;
    expect(suma(2, 3)).toBe(5);
  });

  it('debería verificar que una cadena sea correcta', () => {
    const texto = 'Hola Mundo';
    expect(texto).toContain('Hola');
  });
});
