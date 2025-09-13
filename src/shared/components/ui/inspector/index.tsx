/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import './inspect.css';
import React, { useEffect, useRef, useState } from 'react';
import { getExposedProperties, ExposedMeta, ParamMeta } from '@Shared/controllers/meta/decorators';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { IconButton } from '@mui/material';
import { CHANNEL_NAME } from '@Shared/constants';
import { BaseMessage, createSecureChannel, SecureChannelTypeWithRequiredPayload } from '@Shared/modules/channel';
import { PresetAction } from '@Shared/types/dispatch.type';
// import { EVENTS } from '@Shared/constants/event';
// import { DispatchEventType } from '@Shared/type';

export function Inspector({ instance }: { instance: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const exposedProps = getExposedProperties(instance);
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [presetData, setPresetData] = useState<BaseMessage | undefined>(undefined);

  //--------------- CHANNEL --------------- //
  const inspectorChannelRef = useRef<
    Record<string, SecureChannelTypeWithRequiredPayload | undefined>
  >({});

  const updateParam = (methodKey: string, paramName: string, value: any) => {
    setParamValues(prev => ({
      ...prev,
      [`${methodKey}.${paramName}`]: value,
    }));
  };

  /**
   * Updates the instance property with the new value.
   * If the value is a number, it will be converted to a number before being assigned to the instance.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event that triggered the property change.
   * @param {string} key - The key of the property to update.
   * @param {any} value - The new value of the property.
   * @returns {void}
   */
  const propertyChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, value: any) => {
    return (instance[key] = typeof value === 'number' ? Number(e.target.value) : e.target.value);
  };

  const onMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
    propertyData: ParamMeta
  ) => {
    const val =
      propertyData.type === 'number'
        ? Number(event.target.value)
        : propertyData.type === 'boolean'
          ? event.target.checked
          : event.target.value;
    updateParam(key, propertyData.name, val);
  };

  const onRunCommand = (params: ParamMeta[], key: string) => {
    const args = params?.map(p => paramValues[`${key}.${p.name}`]) ?? [];
    instance[key](...args);
  };

  // const handleInspectorToggle = (event: DispatchEventType) => {
  //   if (
  //     event.payload &&
  //     'command' in event.payload &&
  //     event.payload.command &&
  //     'value' in event.payload.command &&
  //     event.payload.command.value &&
  //     typeof event.payload.command.value.isOpen === 'boolean'
  //   ) {
  //     setIsOpen(event.payload.command.value.isOpen);
  //   }
  // };
  useEffect(() => {
    const inspectorChannel = createSecureChannel(CHANNEL_NAME.INSPECTOR, (message: BaseMessage) => {
      if (message.type === PresetAction.OPEN_INSPECTOR) {
        setIsOpen(true);
        setPresetData(message);
      }
    });
    inspectorChannelRef.current.inspector = inspectorChannel;
    return () => {
      inspectorChannel?.close();
      delete inspectorChannelRef.current.inspector;
    };
  }, []);

  console.log('presetData', presetData);

  return (
    <div className={`inspector-container ${isOpen ? 'open' : ''}`}>
      <IconButton className="close-inspector" onClick={() => setIsOpen(false)}>
        <DisabledByDefaultRoundedIcon />
      </IconButton>
      <h3>Inspector</h3>
      {Object.entries(presetData?.payload ?? {}).map(([key, value]) => (
        <div key={key} className="props-list">
          <label>{key}: </label>
          <input
            type={typeof value === 'number' ? 'number' : 'text'}
            defaultValue={value}
            onChange={e => propertyChange(e, key, value)}
          />
        </div>
      ))}
      {/* {exposedProps.map(({ key, kind, params, render }: ExposedMeta) => {
        if (render) {
          return <div key={key}>{render(instance)}</div>;
        }
        const value = instance[key];
        if (kind === 'property') {
          return (
            <div key={key} className="props-list">
              <label>{key}: </label>
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                value={value}
                onChange={e => propertyChange(e, key, value)}
              />
            </div>
          );
        }

        if (kind === 'method') {
          return (
            <div key={key} className="methods-list">
              <strong>{key}()</strong>
              {params?.map(p => (
                <div key={p.name} className="params-list">
                  <label>{p.name}: </label>
                  <input
                    type={
                      p.type === 'number' ? 'number' : p.type === 'boolean' ? 'checkbox' : 'text'
                    }
                    value={
                      p.type === 'boolean' ? undefined : (paramValues[`${key}.${p.name}`] ?? '')
                    }
                    checked={
                      p.type === 'boolean' ? (paramValues[`${key}.${p.name}`] ?? false) : undefined
                    }
                    onChange={e => onMethodChange(e, key, p)}
                  />
                </div>
              ))}
              <button className="props-list" onClick={() => onRunCommand(params ?? [], key)}>
                Run
              </button>
            </div>
          );
        }

        return null;
      })} */}
    </div>
  );
}
