export interface EventBase {
  type: string;
}

export class EventBus<E extends EventBase> {
  private listeners: {
    [K in E["type"]]?: ((ev: Extract<E, { type: K }>) => void)[];
  } = {};

  on<K extends E["type"]>(
    type: K,
    listener: (event: Extract<E, { type: K }>) => void
  ) {
    (this.listeners[type] ||= []).push(listener);
  }

  emit<K extends E["type"]>(event: Extract<E, { type: K }>) {
    this.listeners[event.type]?.forEach((l) => l(event));
  }
}

type ChatEvents =
  | { type: "message"; from: string; text: string }
  | { type: "join"; user: string }
  | { type: "leave"; user: string };

const chatBus = new EventBus<ChatEvents>();

chatBus.on("message", (e) => console.log(`${e.from}: ${e.text}`));
chatBus.emit({ type: "join", user: "Me" });

//this would error out:
// chatBus.emit({ type: "oops", user: "Me" });
