import { ConflictException, Injectable, OnApplicationBootstrap, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { Model, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.model';
import crypto = require('crypto');

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const userCheck = await this.userModel.findOne({ phone: signUpDto.phone }, { _id: 1 });
    if (userCheck) {
      throw new ConflictException();
    }
    
    const salt = this.genRandomStr();
    const password = this.sha512(signUpDto.password + salt);
    const user = await this.userModel.create(Object.assign(signUpDto, { salt, password }));
    return user;
  }

  async loginCheck(loginDto: LoginDto): Promise<UserDocument> {
    const user = (await this.userModel.findOne({ phone: loginDto.phone }, { salt: 1, password: 1, isAdmin: 1 }));
    if (!user) {
      throw new UnauthorizedException('phone and password not matched');
    }

    const encode = this.sha512(loginDto.password + user.salt);
    if (encode != user.password) {
      throw new UnauthorizedException('phone and password not matched');
    }

    return user;
  }

  genRandomStr() {
    return crypto.randomBytes(8).toString('hex');
  }

  sha512(str: string) {
    const sha512 = crypto.createHash('sha512');
    sha512.update(str);
    return sha512.digest('hex');
  }

  async initAdmin() {
    const adminPhone = process.env.ADMIN_PHONE as string || '18812345678';
    const adminPassword =  process.env.ADMIN_PASSWORD as string || 'admin_secret';
    const flag = await this.userModel.findOne({ phone: adminPhone }, { _id: 1 });
    if (!flag) {
      const admin = await this.signUp({
        name: 'admin',
        password: adminPassword,
        phone: adminPhone,
      });
      await this.userModel.updateOne({ _id: admin._id }, { isAdmin: true });
    }
  }

  async onApplicationBootstrap() {
    await this.initAdmin();
  }

  async getUserInfo(userOid: string): Promise<UserDocument> {
    const user = (await this.userModel.findOne({ _id: userOid }, { phone: 1, name: 1, isAdmin: 1 }));
    return user;
  }
}
