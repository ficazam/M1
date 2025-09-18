import type { EventBase } from "./event-bus";

export class StateMachine<
  S extends string,
  E extends EventBase,
  T extends { [K in S]: Partial<Record<E["type"], S>> }
> {
  private current: S;
  constructor(private readonly transitions: T, initial: S) {
    this.current = initial;
  }

  state(): S {
    return this.current;
  }

  send<K extends E["type"]>(event: Extract<E, { type: K }>): S {
    const next = this.transitions[this.current][event.type];

    if (!next)
      throw new Error(`Invalid transition ${this.current} -> ${event.type}`);

    this.current = next;
    return this.current;
  }
}

type LoginState = "loggedOut" | "loggingIn" | "loggedIn";
type LoginEvent =
  | { type: "startLogin" }
  | { type: "loginSuccess" }
  | { type: "logout" };

const transitions = {
  loggedOut: { startLogin: "loggingIn" },
  loggingIn: { loginSuccess: "loggedIn" },
  loggedIn: { logout: "loggedOut" },
} as const satisfies Record<
  LoginState,
  Partial<Record<LoginEvent["type"], LoginState>>
>;

const loginMachine = new StateMachine<
  LoginState,
  LoginEvent,
  typeof transitions
>(transitions, "loggedOut");