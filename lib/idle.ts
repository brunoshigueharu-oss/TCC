/** Espera, em milissegundos, onde o navegador não avisa quando está à toa. */
const FALLBACK_DELAY = 200;

/** Roda a tarefa quando o navegador estiver à toa. Devolve como cancelar. */
export function scheduleWhenIdle(task: () => void) {
  // O Safari ainda não tem `requestIdleCallback`.
  const requestIdle: typeof window.requestIdleCallback | undefined = window.requestIdleCallback;
  if (requestIdle) {
    const handle = requestIdle(task);
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(task, FALLBACK_DELAY);
  return () => window.clearTimeout(handle);
}

/**
 * Fila de tarefas pesadas que não precisam acontecer agora: roda uma por vez,
 * cada uma num momento em que o navegador está à toa, para nenhuma travar a
 * página.
 *
 * `pause` para a fila sem perder o que falta, e `resume` a retoma: é o par
 * para a desmontagem de um componente, que no modo estrito do React acontece
 * e se desfaz logo em seguida. `dispose` joga fora o que falta.
 */
export function createIdleQueue() {
  const tasks: (() => void)[] = [];
  let cancel: (() => void) | null = null;
  let isPaused = false;

  const runNext = () => {
    cancel = null;
    tasks.shift()?.();
    wake();
  };

  /** Agenda a próxima tarefa, se houver uma e a fila não estiver parada. */
  const wake = () => {
    if (isPaused || tasks.length === 0) return;
    cancel ??= scheduleWhenIdle(runNext);
  };

  const stop = () => {
    cancel?.();
    cancel = null;
  };

  return {
    schedule(task: () => void) {
      tasks.push(task);
      wake();
    },
    pause() {
      isPaused = true;
      stop();
    },
    resume() {
      isPaused = false;
      wake();
    },
    dispose() {
      stop();
      tasks.length = 0;
    },
  };
}
