import { Injectable, NotFoundException } from '@nestjs/common';
import { products, Product } from '../database/in-memory.db';

@Injectable()
export class ProductsService {
  findAll(query?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    featured?: boolean;
  }): Product[] {
    let result = [...products];

    if (query?.category && query.category !== 'all') {
      result = result.filter((p) => p.category === query.category);
    }

    if (query?.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.tags.some((t) => t.toLowerCase().includes(s)),
      );
    }

    if (query?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= query.minPrice!);
    }

    if (query?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= query.maxPrice!);
    }

    if (query?.featured) {
      result = result.filter((p) => p.featured);
    }

    if (query?.sort) {
      switch (query.sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'eco-score':
          result.sort((a, b) => b.ecoScore - a.ecoScore);
          break;
        case 'newest':
          result.reverse();
          break;
        default:
          break;
      }
    }

    return result;
  }

  findOne(id: string): Product {
    const product = products.find((p) => p.id === id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  findByCategory(category: string): Product[] {
    return products.filter((p) => p.category === category);
  }

  getFeatured(): Product[] {
    return products.filter((p) => p.featured);
  }

  getStats() {
    return {
      totalProducts: products.length,
      categories: [...new Set(products.map((p) => p.category))].length,
      avgEcoScore: (
        products.reduce((s, p) => s + p.ecoScore, 0) / products.length
      ).toFixed(1),
      inStock: products.filter((p) => p.stock > 0).length,
    };
  }
}