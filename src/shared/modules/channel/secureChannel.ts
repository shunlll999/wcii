import { DEFAULT_SECURE_CODE, SECRET } from "../constants/channel.const";
import { createReplayCache } from "./channel.cache";
import { BaseMessage, SecureChannelOprions, SignedMessage } from "./channel.interface";
import { MessageHandler } from "./channel.type";
import { signMessage } from "./channel.util";
import { logValidationError, validationMessage } from "./channel.validation";

function createSecureChannel<T = unknown>(
  channelName: string,
  onMessage: MessageHandler<T>,
  options: SecureChannelOprions = {}
) {
  const {
    MAX_AGE_MS = DEFAULT_SECURE_CODE.MAX_AGE_MS,
    MAX_FUTURE_SKEW_MS = DEFAULT_SECURE_CODE.MAX_FUTURE_SKEW_MS,
    CLEANUP_INTERNAL_MS = DEFAULT_SECURE_CODE.CLEANUP_INTERNAL_MS,
    CACHE_TTL_MS = DEFAULT_SECURE_CODE.CACHE_TTL_MS,
  } = options;

  const bc = new BroadcastChannel(channelName);
  const replayCache = createReplayCache(CACHE_TTL_MS);
  const cleanupInterval = setInterval(() => {
    replayCache.cleanup();
  }, CLEANUP_INTERNAL_MS);

  bc.onmessage = async (e: MessageEvent<SignedMessage<T>>) => {
    const message = e.data;

    try {
      const validation = await validationMessage(message, replayCache, [MAX_AGE_MS, MAX_FUTURE_SKEW_MS]);
      if (!validation.valid) {
        logValidationError(validation.error, channelName, message, validation.details);
        return;
      }

      replayCache.add(message.messageId);
      onMessage(message);
    } catch (error) {
      console.error(`[${channelName}] 💥 Processing error:`, error, message);
    }
  };

  async function send(from: string, type: string, payload: T): Promise<void> {
    const base: BaseMessage<T> = {
      messageId: (crypto.randomUUID() && crypto.randomUUID()) || `${Date.now()}-${Math.random()}`,
      from,
      type,
      payload,
      timestamp: Date.now(),
    }

    bc.postMessage(await signMessage(base));
  }

  function close(): void {
    clearInterval(cleanupInterval);
    bc.close();
  }

  return {
    send,
    close,
  };
}

export { createSecureChannel };
