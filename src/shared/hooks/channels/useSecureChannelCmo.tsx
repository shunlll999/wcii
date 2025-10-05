import { BaseMessage, createSecureChannel } from '@Shared/modules/channel';
import { useEffect, useMemo, useRef } from 'react';

type UseSecureChannelOptions = {
  channelName: string;
  factoryMessage: (message: BaseMessage) => void;
  autoClose?: boolean;
};

export const useSecureChannelCmo = (opts: UseSecureChannelOptions) => {
  const { channelName, factoryMessage, autoClose } = opts;
  const channel = useMemo(
    () => {
      console.log('channelName', channelName);
      return createSecureChannel(channelName, factoryMessage)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handlerRef = useRef(factoryMessage);
  handlerRef.current = factoryMessage;

  useEffect(() => {
    // if (handlerRef.current) {
    //   channel.attach((msg) => handlerRef.current?.(msg));
    // } else {
    //   channel.attach(() => {});
    // }
    return () => {
      if (autoClose) channel.close();
    };
  }, [channel, autoClose]);

  return channel;
};
