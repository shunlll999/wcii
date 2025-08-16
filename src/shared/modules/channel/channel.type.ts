import { MessageValidationError } from "./channel.enum";
import { SignedMessage } from "./channel.interface";

export type MessageHandler<T = unknown> = (message: SignedMessage<T>) => void;
export type ValidationResult =
  | { valid: true }
  | { valid: false; error: MessageValidationError; details?: any }
