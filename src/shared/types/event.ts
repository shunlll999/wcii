export type EventHandlers = {
  [k in keyof React.DOMAttributes<HTMLDivElement>]?: React.DOMAttributes<HTMLDivElement>[k];
};


