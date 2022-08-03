import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  price: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
