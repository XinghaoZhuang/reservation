import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationServiceInput } from './dto/create-reservation.input';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation, ReservationDocument } from './entities/reservation.entity';
import { Model } from 'mongoose';
import { ListReservationFilter, ListReservationPagination } from './dto/list-reservation.input';

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

  findOne(id: string) {
    return this.reservationModel.findOne({ _id: id }).exec();
  }

  async update(updateReservationInput: UpdateReservationInput) {
    const reservation = await this.reservationModel.findOne({ _id: updateReservationInput._id }, { _id: 1 });
    if (!reservation) {
      throw new NotFoundException('reservation not found');
    }

    await this.reservationModel.updateOne({ _id: updateReservationInput._id }, updateReservationInput);
  }
}
