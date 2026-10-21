import { z } from "zod";

/** Tamanho mínimo da senha (repetido no texto de ajuda do cadastro). */
export const PASSWORD_MIN_LENGTH = 8;

const emailField = z.email("Informe um e-mail válido.");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Informe sua senha."),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  email: emailField,
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`),
  acceptedTerms: z.boolean().refine((value) => value, {
    message: "Para criar a conta, aceite os Termos de uso e a Política de privacidade.",
  }),
});

export const consentSchema = z.object({
  personalizeTrack: z.boolean(),
  notifications: z.boolean(),
  emailUpdates: z.boolean(),
});

/** Uma escolha única (onboarding e nivelamento). */
export const singleChoiceSchema = z.object({
  choice: z.string().min(1, "Escolha uma opção para continuar."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ConsentInput = z.infer<typeof consentSchema>;
export type SingleChoiceInput = z.infer<typeof singleChoiceSchema>;
