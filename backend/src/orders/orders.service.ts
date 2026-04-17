import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { orders, Order, products } from '../database/in-memory.db';
import { CartService } from '../cart/cart.service';
import { v4 as uuidv4 } from 'uuid';

export interface CreateOrderDto {
  sessionId: string;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
  };
}

@Injectable()
export class OrdersService {
  constructor(private readonly cartService: CartService) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const cart = this.cartService.getCart(dto.sessionId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Deduct stock
    for (const item of cart.items) {
      const product = products.find((p) => p.id === item.product?.id);
      if (!product) throw new NotFoundException('Product not found');
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
      product.stock -= item.quantity;
    }

    const order: Order = {
      id: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
      sessionId: dto.sessionId,
      items: cart.items.map((i) => ({
        productId: i.product!.id,
        productName: i.product!.name,
        quantity: i.quantity,
        price: i.product!.price,
      })),
      total: cart.total,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      customerInfo: dto.customerInfo,
    };

    orders.push(order);
    this.cartService.clearCart(dto.sessionId);

    return order;
  }

  findBySession(sessionId: string): Order[] {
    return orders.filter((o) => o.sessionId === sessionId);
  }

  findOne(id: string): Order {
    const order = orders.find((o) => o.id === id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  findAll(): Order[] {
    return orders;
  }
}