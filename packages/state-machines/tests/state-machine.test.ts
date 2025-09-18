import { expect, expectTypeOf, test } from "vitest";
import { EventBus, StateMachine } from "../src";

type ChatEvents =
  | { type: "message"; from: string; text: string }
  | { type: "join"; user: string }
  | { type: "leave"; user: string };

test("EventBus enforces event types", () => {
  const bus = new EventBus<ChatEvents>();
  bus.on("join", (e) => expect(e.user).toBeDefined());
  bus.emit({ type: "join", user: "Felipe" });
  // @ts-expect-error invalid event type
  bus.emit({ type: "joined", user: "Felipe" });
});

type LoginState = "loggedOut" | "loggingIn" | "loggedIn";
type LoginEvent =
  | { type: "startLogin" }
  | { type: "loginSuccess" }
  | { type: "logout" };

test("StateMachine only allows valid transitions", () => {
  const machine = new StateMachine<
    LoginState,
    LoginEvent,
    {
      loggedOut: { startLogin: "loggingIn" };
      loggingIn: { loginSuccess: "loggedIn" };
      loggedIn: { logout: "loggedOut" };
    }
  >(
    {
      loggedOut: { startLogin: "loggingIn" },
      loggingIn: { loginSuccess: "loggedIn" },
      loggedIn: { logout: "loggedOut" },
    },
    "loggedOut"
  );

  expect(machine.state()).toBe("loggedOut");

  machine.send({ type: "startLogin" });
  expect(machine.state()).toBe("loggingIn");

  expect(() => machine.send({ type: "logout" })).toThrowError(
    /Invalid transition.*loggingIn -> logout/
  );

  machine.send({ type: "loginSuccess" });
  expect(machine.state()).toBe("loggedIn");

  machine.send({ type: "logout" });
  expect(machine.state()).toBe("loggedOut");
});
