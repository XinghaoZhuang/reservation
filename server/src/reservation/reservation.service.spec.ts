import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { Model } from 'mongoose';
import { Reservation, Status, TableSize } from './entities/reservation.entity';
import { CreateReservationServiceInput } from './dto/create-reservation.input';
import { getModelToken } from '@nestjs/mongoose';

describe('ReservationService', () => {
  let service: ReservationService;
  let model: Model<Reservation>;

  const now = new Date();
  const createReservationInput: CreateReservationServiceInput = {
    guest: 'user_id',
    expectedArrivalTime: now,
    tableSize: TableSize.SMALL,
  };

  const mockReservation1 = {
    _id: 'reservation_1',
    guest: 'user_id',
    expectedArrivalTime: now,
    tableSize: TableSize.SMALL,
    status: Status.BOOKED,
  }

  const mockReservation2 = {
    _id: 'reservation_2',
    guest: 'user_id',
    expectedArrivalTime: now,
    tableSize: TableSize.SMALL,
    status: Status.CANCELED,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getModelToken('Reservation'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn().mockResolvedValue(mockReservation1),
            skip: jest.fn(),
            sort: jest.fn(),
            limit: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    model = module.get<Model<Reservation>>(getModelToken('Reservation'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne()', () => {
    it('should return all reservations', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockReservation1)
      } as any);
      const result = await service.findOne({ _id: 'reservation_1' });
      expect(result).toEqual(mockReservation1);
    });
  });

  describe('create()', () => {
    it('should return all reservations', async () => {
      const result = await service.create(createReservationInput);
      expect(result).toEqual(mockReservation1);
    });
  });

  describe('findAll()', () => {
    it('should return all reservations', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([mockReservation1, mockReservation2]),
            } as any)
          } as any)
        } as any)
      } as any);
      const results = await service.findAll({ page: 1, perPage: 10 });
      expect(results).toEqual([mockReservation1, mockReservation2]);
    });
  });

  describe('updateOne()', () => {
    it('should update reservation', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockReservation1)
      } as any);
      await service.update({ _id: 'reservation_1' });
      expect(model.updateOne).toHaveBeenCalled();
    });

    it('should throw a not-found error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
      await expect(service.update({ _id: 'reservation_1' })).rejects.toThrow('reservation not found')
    });
  });
});
