/** Retorno padrão das Server Actions do fluxo de entrada. */
export type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};
