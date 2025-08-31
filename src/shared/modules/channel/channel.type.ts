import { MessageValidationError } from "./channel.enum";
import { SignedMessage } from "./channel.interface";

export type Details = {
  age?: number;
  skew?: number;
};

export type MessageHandler<T = unknown> = (message: SignedMessage<T>) => void;

export type ValidationResult<Details = unknown> =
  | { valid: true }
  | { valid: false; error: MessageValidationError; details?: Details };
