import { Resolver, Query, Mutation, Args, ResolveField, Parent, Context } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationCount, ReservationDocument, Status } from './entities/reservation.entity';
import { CreateReservationInput, CreateReservationServiceInput } from './dto/create-reservation.input';
import { UpdateReservationInput, UpdateReservationServiceInput } from './dto/update-reservation.input';
import { Session, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ListReservationFilter, ListReservationPagination } from './dto/list-reservation.input';
import { AuthGuard } from '../guards/auth.guard';
import { FindReservationServiceInput } from './dto/find-reservation.input';
import { User } from 'src/user/user.model';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Reservation)
  createReservation(
    @Args('createReservationInput') createReservationInput: CreateReservationInput, 
    @Context() context
  ) {
    const session = context.req.session;
    const body: CreateReservationServiceInput = Object.assign(createReservationInput, { guest: session.userOid });
    return this.reservationService.create(body);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Reservation], { name: 'reservations' })
  findAll(
    @Context() context,
    @Args('pagination') pagination: ListReservationPagination,
    @Args('filter', { nullable: true }) filter?: ListReservationFilter,
  ) {
    const session = context.req.session;
    if (!session.isAdmin) {
      filter.guest = session.userOid;
    }
    console.log(session, 's', filter)
    return this.reservationService.findAll(pagination, filter);
  }

  @UseGuards(AuthGuard)
  @Query(() => ReservationCount, { name: 'reservationCount' })
  async count(
    @Context() context,
    @Args('filter') filter?: ListReservationFilter,
  ) {
    const session = context.req.session;
    if (!session.isAdmin) {
      filter.guest = session.userOid;
    }
    return { count: await this.reservationService.count(filter) };
  }

  @UseGuards(AuthGuard)
  @Query(() => Reservation, { name: 'reservation' })
  findOne(
    @Args('id', { type: () => String }) id: string, 
    @Context() context
  ) {
    const session = context.req.session;
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
    @Context() context,
    @Args('updateReservationInput') updateReservationInput: UpdateReservationInput
  ) {
    const session = context.req.session;
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
