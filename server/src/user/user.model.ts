import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
@Schema()
export class User {
  @ApiProperty()
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Field(() => String)
  @Prop()
  name: string;

  @ApiProperty()
  @Field(() => String)
  @Prop({ unique: true })
  phone: string;

  @Prop()
  password: string;

  @Prop()
  salt: string;

  @ApiProperty()
  @Field(() => Boolean)
  @Prop({ default: false })
  isAdmin: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);