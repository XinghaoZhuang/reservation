import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Model } from 'mongoose';
import { User } from 'src/user/user.model';
import { SignUpDto } from './dto/sign-up.dto';
import crypto = require('crypto');
import { getModelToken } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';

const encode = (str: string) => {
  const sha512 = crypto.createHash('sha512');
  sha512.update(str);
  return sha512.digest('hex');
};

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;

  const signUpDto: SignUpDto = {
    name: 'user1',
    phone: '13012345678',
    password: 'password',
  };

  const loginDto: LoginDto = {
    phone: 'user1',
    password: 'password',
  }

  const mockUser = {
    name: 'user1',
    phone: '13012345678',
    password: encode('password' + 'salt'),
    salt: 'salt',
    isAdmin: false,
  };

  const mockUser2 = {
    name: 'user2',
    phone: '14012345678',
    password: encode('password2' + 'salt2'),
    salt: 'salt2',
    isAdmin: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockResolvedValue(mockUser),
            updateOne: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model.create).toBeDefined();
  });

  describe('signUp()', () => {
    it('should sign up a new user', async () => {
      const newUser = await service.signUp(signUpDto);
      expect(newUser).toEqual(mockUser);
    });
  });

  describe('loginCheck()', () => {
    it('should login', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      await expect(service.loginCheck(loginDto)).resolves.not.toThrow();
    });

    it('should receive error, for user not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
      await expect(service.loginCheck(loginDto)).rejects.toThrow('phone and password not matched');
    });

    it('should receive error, for password not matched', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser2);
      await expect(service.loginCheck(loginDto)).rejects.toThrow('phone and password not matched');
    });
  });

  describe('initAdmin()', () => {
    it('should create admin', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
      await service.initAdmin();
      expect(model.updateOne).toHaveBeenCalled();
    });

    it('should do nothing', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      await service.initAdmin();
      expect(model.updateOne).toHaveBeenCalledTimes(0);
    });
  });

  describe('getUserInfo()', () => {
    it('should return user info', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      const user = await service.getUserInfo('user1');
      expect(user).toEqual(mockUser);
    });
  });
});
