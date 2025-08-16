import { SECRET } from "../constants/channel.const";
import { BaseMessage, SignedMessage } from "./channel.interface";

//----- cryto utils -----
async function generateSignature<T>(secret: string, data: BaseMessage<T>): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(JSON.stringify(data));

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatireBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const bytes = new Uint8Array(signatireBuffer);
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

async function signMessage<T>(message: BaseMessage<T>): Promise<SignedMessage<T>> {
  const signature = await generateSignature(SECRET, message);
  return {
    ...message,
    signature,
  };
}

async function verifySignature<T>(message: SignedMessage<T>): Promise<boolean> {
  const { signature, ...original } = message;
  const expectedSignature = await generateSignature(SECRET, original);
  return expectedSignature === signature;
}

export {
  generateSignature,
  signMessage,
  verifySignature
}
