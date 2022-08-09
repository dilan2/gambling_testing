import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../../auth/roles.enum';

export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: Roles.Player, immutable: false })
  role: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
