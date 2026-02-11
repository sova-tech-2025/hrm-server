import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GetTokensDto } from './dto/getTokens.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('access-service-login')
  redirectAccessService(@Res() res: Response) {
    const redirectUrl = this.authService.redirectAccessService();
    return res.redirect(redirectUrl);
  }

  @Post('/get-tokens')
  getTokens(@Body() dto: GetTokensDto, @Res() res: Response) {
    return this.authService.getTokens(dto.code, res);
  }
}
