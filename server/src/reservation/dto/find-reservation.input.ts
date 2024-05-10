import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class FindReservationInput {
  @Field(() => String)
  _id: string;
}

export class FindReservationServiceInput extends PartialType(FindReservationInput) {
  guest?: string;
}
