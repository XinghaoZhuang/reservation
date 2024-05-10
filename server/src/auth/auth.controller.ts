import { Controller, Get, Post, Body, Patch, Param, Delete, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>) {
    const user = await this.authService.loginCheck(loginDto);
    session.userOid = user._id.toString();
    session.isAdmin = user.isAdmin;
  }
}
