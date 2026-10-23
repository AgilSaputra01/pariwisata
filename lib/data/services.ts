import products from './products.json';
import { TransportService, ServiceCategory } from '@/types';

export const getProducts = (lang: string = "id"): TransportService[] => {
  return products.map((product: any) => {
    const translation = product.translations[lang] || product.translations['en'] || product.translations['id'];
    
    return {
      id: product.id,
      category: product.category as ServiceCategory,
      priceStartingFrom: product.priceStartingFrom,
      popular: product.popular,
      badge: product.badge,
      image: product.image,
      name: translation.name,
      description: translation.description,
      capacity: translation.capacity,
      luggageCapacity: translation.luggageCapacity,
      included: translation.included,
    };
  });
};

// Fallback for server components or default imports
export const POPULAR_SERVICES = getProducts("id");
