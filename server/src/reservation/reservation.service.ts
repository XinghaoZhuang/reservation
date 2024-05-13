import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationServiceInput } from './dto/create-reservation.input';
import { UpdateReservationInput, UpdateReservationServiceInput } from './dto/update-reservation.input';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation, ReservationDocument } from './entities/reservation.entity';
import { Model } from 'mongoose';
import { ListReservationFilter, ListReservationPagination } from './dto/list-reservation.input';
import { FindReservationServiceInput } from './dto/find-reservation.input';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
  ) {}

  async create(createReservationServiceInput: CreateReservationServiceInput) {
    const reservation = await this.reservationModel.create(createReservationServiceInput)
    return reservation;
  }

  findAll(pagination: ListReservationPagination, filter?: ListReservationFilter) {
    return this.reservationModel.find({ ... filter })
      .skip(pagination.page * pagination.perPage)
      .limit(pagination.perPage)
      .sort('expectedArrivalTime').exec();
  }

  count(filter?: ListReservationFilter) {
    return this.reservationModel.countDocuments({ ... filter }).exec();
  }

  findOne(findReservationServiceInput: FindReservationServiceInput) {
    return this.reservationModel.findOne(findReservationServiceInput).exec();
  }

  async update(updateReservationServiceInput: UpdateReservationServiceInput) {
    const filter = {
      _id: updateReservationServiceInput._id,
      guest: updateReservationServiceInput.guest,
    };

    const reservation = await this.reservationModel.findOne(filter, { _id: 1 });
    if (!reservation) {
      throw new NotFoundException('reservation not found');
    }

    await this.reservationModel.updateOne({ _id: updateReservationServiceInput._id }, updateReservationServiceInput);
    return reservation;
  }
}
