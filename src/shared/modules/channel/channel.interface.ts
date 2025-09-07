import { PresetType } from "@Shared/types";

export interface BaseMessage<T = PresetType> {
  messageId: string;
  from: string;
  type: string;
  payload: T;
  timestamp: number;
}

export interface SignedMessage<T = unknown> extends BaseMessage<T> {
  signature: string;
}

export interface SecureChannelOprions {
  MAX_AGE_MS?: number;
  MAX_FUTURE_SKEW_MS?: number;
  CLEANUP_INTERNAL_MS?: number;
  CACHE_TTL_MS?: number;
}

export interface SecureChannelType {
  send: (to: string, event: string, payload?: PresetType) => Promise<void>;
  close: () => void;
}

export interface SecureChannelTypeWithRequiredPayload extends Omit<SecureChannelType, 'send'> {
  send: (to: string, event: string, payload: PresetType) => Promise<void>;
  close: () => void;
};
