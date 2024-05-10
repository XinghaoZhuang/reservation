import { Status, TableSize } from '../entities/reservation.entity';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReservationInput {
  @Field(() => String)
  _id: string;

  @Field(() => Date, { description: 'expected arrival time', nullable: true })
  expectedArrivalTime?: Date;

  @Field(() => String, { description: 'reserved table size', nullable: true })
  tableSize?: TableSize;

  @Field(() => String, { description: 'reservation status', nullable: true })
  status?: Status;
}

export class UpdateReservationServiceInput extends PartialType(UpdateReservationInput) {
  guest?: string;
}
