import { MessageHandler, SignedMessage } from "@Shared/modules/channel";
import { PresetType } from "@Shared/types";
import { createContext } from "react";


export type ChannelNameType = 'NAVIGATION' | 'PRESET' | 'COMPONENT' | 'PAGE' | 'INSPECTOR' | 'STORE';
export type ChannelInstance = {
    send: (from: string, type: string, payload: unknown) => Promise<void>;
    close: () => void;
    onMessage: (handler: MessageHandler<PresetType>) => Promise<void>;
    attach(handler: (msg: SignedMessage<PresetType>) => void): void;
};

export type ChannelsType = {
    NAVIGATION: ChannelInstance;
    PRESET: ChannelInstance;
    COMPONENT: ChannelInstance;
    PAGE: ChannelInstance;
    INSPECTOR: ChannelInstance;
    STORE: ChannelInstance;
};
export type BuilderContextType = {
  channels: ChannelsType;
}



export const BuilderContext = createContext<BuilderContextType>({
  channels: {
    NAVIGATION: {} as ChannelInstance,
    PRESET: {} as ChannelInstance,
    COMPONENT: {} as ChannelInstance,
    PAGE: {} as ChannelInstance,
    INSPECTOR: {} as ChannelInstance,
    STORE: {} as ChannelInstance,
  }
});

