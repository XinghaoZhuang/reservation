import { Test, TestingModule } from '@nestjs/testing';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';

describe('ReservationResolver', () => {
  let resolver: ReservationResolver;
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationResolver, 
        {
          provide: ReservationService,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            udpate: jest.fn(),
          }
        }
      ],
    }).compile();

    resolver = module.get<ReservationResolver>(ReservationResolver);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
