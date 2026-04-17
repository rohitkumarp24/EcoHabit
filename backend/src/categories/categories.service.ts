import { Injectable } from '@nestjs/common';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

@Injectable()
export class CategoriesService {
  private readonly categories: Category[] = [
    {
      id: 'bamboo-cleaning',
      name: 'Bamboo Cleaning Supplies',
      description: 'Sustainable bamboo-based cleaning tools for every surface',
      icon: '🎋',
      productCount: 4,
    },
    {
      id: 'biodegradable-kitchenware',
      name: 'Biodegradable Kitchenware',
      description: 'Eco-friendly kitchen essentials that return to the earth',
      icon: '🍃',
      productCount: 4,
    },
    {
      id: 'reusable-storage',
      name: 'Reusable Storage Solutions',
      description: 'Zero-waste food storage to replace single-use plastics',
      icon: '♻️',
      productCount: 4,
    },
    {
      id: 'eco-cleaning-agents',
      name: 'Eco Cleaning Agents',
      description: 'Plant-based, biodegradable cleaners safe for your family',
      icon: '🌿',
      productCount: 4,
    },
  ];

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: string): Category | undefined {
    return this.categories.find((c) => c.id === id);
  }
}