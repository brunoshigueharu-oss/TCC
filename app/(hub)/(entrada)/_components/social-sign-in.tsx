import type { ComponentType, SVGProps } from "react";

import { ColorBurstButton } from "@/components/color-burst-button";
import { continueWithProvider, type SocialDestination } from "../_actions/continue-with-provider";

type Provider = {
  id: "google" | "github" | "apple";
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.65 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.68 3.7 14.55 2.75 12 2.75 6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25c5.34 0 8.88-3.75 8.88-9.04 0-.6-.07-1.07-.15-1.53Z" />
    </svg>
  );
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.1 10.1 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function AppleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.37 12.6c-.02-2.23 1.82-3.3 1.9-3.35-1.04-1.52-2.65-1.72-3.22-1.75-1.37-.14-2.68.81-3.37.81-.7 0-1.77-.79-2.9-.77-1.5.02-2.87.87-3.64 2.2-1.55 2.69-.4 6.67 1.11 8.85.74 1.07 1.62 2.27 2.77 2.22 1.11-.04 1.53-.72 2.88-.72 1.34 0 1.72.72 2.9.7 1.2-.02 1.96-1.08 2.69-2.16.85-1.24 1.2-2.44 1.22-2.5-.03-.01-2.33-.9-2.34-3.53ZM14.15 6.04c.61-.74 1.03-1.77.91-2.79-.88.04-1.95.59-2.58 1.33-.57.65-1.07 1.7-.93 2.7.98.08 1.98-.5 2.6-1.24Z" />
    </svg>
  );
}

const providers: Provider[] = [
  { id: "google", label: "Continuar com Google", Icon: GoogleIcon },
  { id: "github", label: "Continuar com GitHub", Icon: GitHubIcon },
  { id: "apple", label: "Continuar com Apple", Icon: AppleIcon },
];

type SocialSignInProps = {
  /** Para onde segue depois de escolher o provedor. */
  destination: SocialDestination;
};

/**
 * Opções de entrada por conta social (Google, GitHub, Apple), mostradas antes
 * do formulário de e-mail, com o divisor "ou" no fim.
 */
export function SocialSignIn({ destination }: SocialSignInProps) {
  const action = continueWithProvider.bind(null, destination);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 lg:px-6 lg:pt-6">
      <form action={action} className="flex flex-col gap-3">
        {providers.map(({ id, label, Icon }) => (
          <ColorBurstButton
            key={id}
            type="submit"
            name="provider"
            value={id}
            variant="secondary"
            className="w-full"
          >
            <Icon />
            {label}
          </ColorBurstButton>
        ))}
      </form>

      <div className="flex items-center gap-3 text-xs text-texto-secundario" aria-hidden="true">
        <span className="h-px flex-1 bg-linha" />
        ou
        <span className="h-px flex-1 bg-linha" />
      </div>
    </div>
  );
}
