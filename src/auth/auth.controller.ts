import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const validatedUser = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!validatedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(validatedUser);
  }
}
