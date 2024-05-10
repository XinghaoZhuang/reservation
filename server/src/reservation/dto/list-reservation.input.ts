import { InputType, Field, Int } from '@nestjs/graphql';


@InputType()
export class ListReservationPagination {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  perPage: number;
}

@InputType()
export class ListReservationFilter {
  @Field(() => String)
  guest?: string;

  @Field(() => String)
  status?: string;
}

