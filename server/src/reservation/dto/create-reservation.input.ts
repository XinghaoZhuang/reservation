import { InputType, Field, PartialType } from '@nestjs/graphql';
import { TableSize } from '../entities/reservation.entity';

@InputType()
export class CreateReservationInput {
  @Field(() => Date, { description: 'expected arrival time' })
  expectedArrivalTime: Date;

  @Field(() => String, { description: 'reserved table size' })
  tableSize: TableSize;
}

export class CreateReservationServiceInput extends PartialType(CreateReservationInput) {
  guest: string;
}
