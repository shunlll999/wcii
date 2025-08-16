import { DEFAULT_SECURE_CODE } from "../constants/channel.const";
import { createReplayCache } from "./channel.cache";
import { MessageValidationError } from "./channel.enum";
import { SignedMessage } from "./channel.interface";
import { ValidationResult } from "./channel.type";
import { verifySignature } from "./channel.util";

function logValidationError<T>(
  error: MessageValidationError,
  channelName: string,
  message: SignedMessage<T>,
  details?: any
) {
  const errorMessage = {
    [MessageValidationError.INVALID_SIGNATURE]: `❌ Invalid signature for message`,
    [MessageValidationError.TOO_DOLD]: `⏱️ Message is too old (age: ${details?.age}ms)`,
    [MessageValidationError.TOO_FUTURE]: `⏳ Message is too far in the future (skew: ${details?.skew}ms)`,
    [MessageValidationError.MISSING_MESSAGE_ID]: `❗ Message is missing messageId`,
    [MessageValidationError.DUPLICATE_MESSAGE]: `🔁 Duplicate message detected`,
    [MessageValidationError.PROCESSED_ERROR]: `[${channelName}] 💥 Processing error:`,
  };

  console.warn(errorMessage[error], channelName, message, details);
}

async function validationMessage<T>(
  message: SignedMessage<T>,
  replayCache: ReturnType<typeof createReplayCache>,
  options: number[]
): Promise<ValidationResult> {
  const signatureValid = await verifySignature(message);
  if (!signatureValid) {
    return { valid: false, error: MessageValidationError.INVALID_SIGNATURE };
  }

  const now = Date.now();
  const age = now - message.timestamp;
  const validationObject = {
    [DEFAULT_SECURE_CODE.MAX_AGE_MS]: (option: number) => {
       if (age > option) {
        return { valid: false, error: MessageValidationError.TOO_DOLD, details: { age, maxAge: option } };
      }
    },
    [DEFAULT_SECURE_CODE.MAX_FUTURE_SKEW_MS]: (option: number) => {
      const futureSkew = message.timestamp - now;
      if (futureSkew > option) {
        return { valid: false, error: MessageValidationError.TOO_FUTURE, details: { skew: futureSkew, maxSkew: option } };
      }
    }
  }
  options.forEach((option) => {
    const validator = validationObject[option];
    if (validator) validator(option);
  });

  if (!message.messageId?.trim()) {
    return { valid: false, error: MessageValidationError.MISSING_MESSAGE_ID };
  }

  if (replayCache.has(message.messageId)) {
    return { valid: false, error: MessageValidationError.DUPLICATE_MESSAGE };
  }

  return { valid: true };
}

export {
  logValidationError,
  validationMessage
}
