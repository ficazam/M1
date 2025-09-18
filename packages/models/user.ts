import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string().min(1),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const ExternalUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string().min(1),
  created_at: z.iso.datetime(),
});

export type ExternalUser = z.infer<typeof ExternalUserSchema>;

export const toDomainUser = (e: ExternalUser): User => ({
  id: e.id,
  email: e.email,
  name: e.name,
  createdAt: new Date(e.created_at),
});
