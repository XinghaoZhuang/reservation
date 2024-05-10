import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
@Schema()
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop({ unique: true })
  phone: string;

  @Field(() => String)
  @Prop()
  password: string;

  @Field(() => String)
  @Prop()
  salt: string;

  @Field(() => Boolean)
  @Prop({ default: false })
  isAdmin: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);