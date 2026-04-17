import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getSessionId(headers: Record<string, string>): string {
    return headers['x-session-id'] || 'default-session';
  }

  @Get()
  getCart(@Headers() headers: Record<string, string>) {
    return this.cartService.getCart(this.getSessionId(headers));
  }

  @Post('add')
  addToCart(
    @Headers() headers: Record<string, string>,
    @Body() body: { productId: string; quantity?: number },
  ) {
    return this.cartService.addToCart(
      this.getSessionId(headers),
      body.productId,
      body.quantity || 1,
    );
  }

  @Put('update/:cartItemId')
  updateQuantity(
    @Headers() headers: Record<string, string>,
    @Param('cartItemId') cartItemId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateQuantity(
      this.getSessionId(headers),
      cartItemId,
      body.quantity,
    );
  }

  @Delete('remove/:cartItemId')
  removeFromCart(
    @Headers() headers: Record<string, string>,
    @Param('cartItemId') cartItemId: string,
  ) {
    return this.cartService.removeFromCart(
      this.getSessionId(headers),
      cartItemId,
    );
  }

  @Delete('clear')
  clearCart(@Headers() headers: Record<string, string>) {
    return this.cartService.clearCart(this.getSessionId(headers));
  }
}