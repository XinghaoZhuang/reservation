import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationDocument, Status } from './entities/reservation.entity';
import { CreateReservationInput, CreateReservationServiceInput } from './dto/create-reservation.input';
import { UpdateReservationInput, UpdateReservationServiceInput } from './dto/update-reservation.input';
import { Session, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ListReservationFilter, ListReservationPagination } from './dto/list-reservation.input';
import { AuthGuard } from '../guards/auth.guard';
import { FindReservationServiceInput } from './dto/find-reservation.input';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Reservation)
  createReservation(
    @Args('createReservationInput') createReservationInput: CreateReservationInput, 
    @Session() session: Record<string, any>
  ) {
    const body: CreateReservationServiceInput = Object.assign(createReservationInput, { guest: session.userOid });
    return this.reservationService.create(body);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Reservation], { name: 'reservation' })
  findAll(
    @Session() session: Record<string, any>,
    @Args('pagination') pagination: ListReservationPagination,
    @Args('filter') filter?: ListReservationFilter,
  ) {
    if (!session.isAdmin) {
      filter.guest = session.userOid;
    }
    return this.reservationService.findAll(pagination, filter);
  }

  @UseGuards(AuthGuard)
  @Query(() => Reservation, { name: 'reservation' })
  findOne(
    @Args('id', { type: () => String }) id: string, 
    @Session() session: Record<string, any>
  ) {
    const filter = { _id: id } as FindReservationServiceInput;
    if (!session.isAdmin) {
      filter.guest = session.userOid;
    }
    return this.reservationService.findOne(filter);
  }

  @ResolveField()
  async guest(
    @Parent() reservation: ReservationDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      await reservation.populate({ path: 'guest' });
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Reservation)
  updateReservation(
    @Session() session: Record<string, any>,
    @Args('updateReservationInput') updateReservationInput: UpdateReservationInput
  ) {
    const updateReservationServiceInput: UpdateReservationServiceInput = updateReservationInput;
    if (!session.isAdmin) {
      if (updateReservationServiceInput.status && updateReservationServiceInput.status != Status.CANCELED) {
        throw new UnauthorizedException();
      }
      updateReservationServiceInput.guest = session.userOid;
    }
    return this.reservationService.update(updateReservationServiceInput);
  }
}
