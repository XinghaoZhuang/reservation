import { Controller, Get, Post, Body, Session, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';

@Controller('/api/auth')
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

  @Get('/login')
  async loginInfo(@Session() session: Record<string, any>) {
    if (session.userOid) {
      const user = await this.authService.getUserInfo(session.userOid);
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
