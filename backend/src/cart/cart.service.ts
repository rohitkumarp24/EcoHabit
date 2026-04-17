import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { carts, CartItem, products } from '../database/in-memory.db';
import { ProductsService } from '../products/products.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartService {
  constructor(private readonly productsService: ProductsService) {}

  getCart(sessionId: string) {
    const items = carts.filter((c) => c.sessionId === sessionId);
    const enriched = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        cartItemId: item.id,
        product,
        quantity: item.quantity,
        subtotal: product ? product.price * item.quantity : 0,
      };
    });

    const total = enriched.reduce((sum, i) => sum + i.subtotal, 0);
    const itemCount = enriched.reduce((sum, i) => sum + i.quantity, 0);

    return { items: enriched, total, itemCount };
  }

  addToCart(sessionId: string, productId: string, quantity: number = 1) {
    const product = this.productsService.findOne(productId);
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const existing = carts.find(
      (c) => c.sessionId === sessionId && c.productId === productId,
    );

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) {
        throw new BadRequestException('Insufficient stock');
      }
      existing.quantity = newQty;
      return { message: 'Cart updated', cartItemId: existing.id };
    }

    const cartItem: CartItem = {
      id: uuidv4(),
      productId,
      quantity,
      sessionId,
    };
    carts.push(cartItem);
    return { message: 'Added to cart', cartItemId: cartItem.id };
  }

  updateQuantity(sessionId: string, cartItemId: string, quantity: number) {
    const item = carts.find(
      (c) => c.id === cartItemId && c.sessionId === sessionId,
    );
    if (!item) throw new NotFoundException('Cart item not found');

    if (quantity <= 0) {
      return this.removeFromCart(sessionId, cartItemId);
    }

    const product = products.find((p) => p.id === item.productId);
    if (product && product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    item.quantity = quantity;
    return { message: 'Quantity updated' };
  }

  removeFromCart(sessionId: string, cartItemId: string) {
    const index = carts.findIndex(
      (c) => c.id === cartItemId && c.sessionId === sessionId,
    );
    if (index === -1) throw new NotFoundException('Cart item not found');
    carts.splice(index, 1);
    return { message: 'Item removed' };
  }

  clearCart(sessionId: string) {
    const indices = carts
      .map((c, i) => (c.sessionId === sessionId ? i : -1))
      .filter((i) => i !== -1)
      .reverse();
    indices.forEach((i) => carts.splice(i, 1));
    return { message: 'Cart cleared' };
  }

  getCartItems(sessionId: string): CartItem[] {
    return carts.filter((c) => c.sessionId === sessionId);
  }
}