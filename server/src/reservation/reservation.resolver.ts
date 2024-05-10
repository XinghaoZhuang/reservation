import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationDocument } from './entities/reservation.entity';
import { CreateReservationInput, CreateReservationServiceInput } from './dto/create-reservation.input';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { Session } from '@nestjs/common';
import { ListReservationFilter, ListReservationPagination } from './dto/list-reservation.input';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @Mutation(() => Reservation)
  createReservation(@Args('createReservationInput') createReservationInput: CreateReservationInput, @Session() session: Record<string, any>) {
    const body: CreateReservationServiceInput = Object.assign(createReservationInput, { guest: session.userOid });
    return this.reservationService.create(body);
  }

  @Query(() => [Reservation], { name: 'reservation' })
  findAll(
    @Args('pagination') pagination: ListReservationPagination,
    @Args('filter') filter?: ListReservationFilter,
  ) {
    return this.reservationService.findAll(pagination, filter);
  }

  @Query(() => Reservation, { name: 'reservation' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.reservationService.findOne(id);
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

  @Mutation(() => Reservation)
  updateReservation(@Args('updateReservationInput') updateReservationInput: UpdateReservationInput) {
    return this.reservationService.update(updateReservationInput);
  }
}
