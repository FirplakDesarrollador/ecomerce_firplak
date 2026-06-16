import { describe, it, expect } from 'vitest';
import { getCategories, getFeaturedProducts } from '../services/home-service';

describe('Home Service', () => {
  it('debería retornar 4 categorías', async () => {
    const categories = await getCategories();
    expect(categories).toHaveLength(4);
    expect(categories[0]).toHaveProperty('id');
    expect(categories[0]).toHaveProperty('name');
    expect(categories[0]).toHaveProperty('imageUrl');
    expect(categories[0]).toHaveProperty('href');
  });

  it('debería retornar 4 productos destacados', async () => {
    const products = await getFeaturedProducts();
    expect(products).toHaveLength(4);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
    expect(products[0]).toHaveProperty('imageUrl');
  });
});
