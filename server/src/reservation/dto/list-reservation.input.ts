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
  @Field(() => String, { nullable: true })
  guest?: string;

  @Field(() => String, { nullable: true })
  status?: string;
}

