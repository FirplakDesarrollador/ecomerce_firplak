import { describe, it, expect } from 'vitest';
import { mockBathroomProducts, formatPrice } from '../services/mock-bathroom-data';

describe('Bathroom Service', () => {
  it('debería retornar 5 productos de muebles de baño', () => {
    expect(mockBathroomProducts).toHaveLength(5);
  });

  it('cada producto debería tener las propiedades requeridas y tipos correctos', () => {
    mockBathroomProducts.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('slug');
      expect(product).toHaveProperty('price');
      expect(product.price).toBeGreaterThan(0);
      expect(product).toHaveProperty('rating');
      expect(product).toHaveProperty('reviewsCount');
      expect(product).toHaveProperty('image');
      expect(product).toHaveProperty('type');
      expect(['Suspendido', 'De piso', 'Auxiliar', 'Espejos']).toContain(product.type);
      expect(product).toHaveProperty('material');
      expect(product).toHaveProperty('dimensions');
      expect(product).toHaveProperty('color');
      expect(product).toHaveProperty('compatibility');
      expect(product).toHaveProperty('availability');
      expect(product).toHaveProperty('features');
      expect(Array.isArray(product.features)).toBe(true);
      expect(product.features.length).toBeGreaterThan(0);
      expect(product).toHaveProperty('isNew');
      expect(product).toHaveProperty('hasFinancing');
      expect(product).toHaveProperty('freeShipping');
      expect(product).toHaveProperty('warranty');
    });
  });

  it('debería formatear los precios en formato COP correctamente', () => {
    const formatted = formatPrice(1250000);
    // Eliminar espacios de no ruptura o raros para evitar fallos de matching
    const cleanFormatted = formatted.replace(/\s/g, ' ');
    expect(cleanFormatted).toContain('$');
    expect(cleanFormatted).toContain('1.250.000');
  });
});
