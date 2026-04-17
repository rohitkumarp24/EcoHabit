import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private getSessionId(headers: Record<string, string>): string {
    return headers['x-session-id'] || 'default-session';
  }

  @Post()
  createOrder(
    @Headers() headers: Record<string, string>,
    @Body()
    body: {
      customerInfo: {
        name: string;
        email: string;
        address: string;
        city: string;
        pincode: string;
      };
    },
  ) {
    return this.ordersService.createOrder({
      sessionId: this.getSessionId(headers),
      customerInfo: body.customerInfo,
    });
  }

  @Get('my-orders')
  getMyOrders(@Headers() headers: Record<string, string>) {
    return this.ordersService.findBySession(this.getSessionId(headers));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}