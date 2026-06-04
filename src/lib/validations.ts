import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, "Must contain uppercase").regex(/[0-9]/, "Must contain number"),
});

export const reportSchema = z.object({
  phone: z.string().optional(),
  telegramUsername: z.string().optional(),
  marketplaceUsername: z.string().optional(),
  marketplaceUrl: z.string().url().optional().or(z.literal("")),
  category: z.enum(["SCAM", "FAKE_PRODUCT", "NON_DELIVERY", "PAYMENT_FRAUD", "ACCOUNT_THEFT", "OTHER"]),
  description: z.string().min(20).max(2000),
  evidenceUrl: z.string().optional(),
});

export const reviewSchema = z.object({
  phone: z.string().optional(),
  telegramUsername: z.string().optional(),
  marketplaceUsername: z.string().optional(),
  description: z.string().min(10).max(2000),
  rating: z.number().int().min(1).max(5),
  evidenceUrl: z.string().optional(),
});

export const commentSchema = z.object({
  reportId: z.string().cuid(),
  content: z.string().min(1).max(1000),
});

export const searchSchema = z.object({
  q: z.string().min(1),
});
