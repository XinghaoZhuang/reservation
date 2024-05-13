import { ObjectType, Field} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/user.model';

export enum TableSize {
  SMALL = 'SMALL', // 2 person
  MEDIUM = 'MEDIUM', // 3-4 person
  LARGE = 'LARGE', // 5-8 person
  EXTREME_LARGE = 'EXTREME_LARGE', // > 9 person
}

export enum Status {
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  BOOKED = 'BOOKED',
}

@ObjectType()
export class ReservationCount {
  @Field()
  count: number;
}

@ObjectType()
@Schema()
export class Reservation {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  guest: MongooseSchema.Types.ObjectId | User;

  @Field(() => Date)
  @Prop({ index: true })
  expectedArrivalTime: Date;

  @Field(() => String)
  @Prop()
  tableSize: TableSize;

  @Field(() => String)
  @Prop({ default: Status.BOOKED, index: true })
  status: Status;
}


export type ReservationDocument = Reservation & Document;

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
