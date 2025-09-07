/* eslint-disable @typescript-eslint/no-explicit-any */
import './inspect.css';
import React, { useState } from 'react';
import { getExposedProperties, ExposedMeta, ParamMeta } from '@Shared/controllers/meta/decorators';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { IconButton } from '@mui/material';
// import { EVENTS } from '@Shared/constants/event';
// import { DispatchEventType } from '@Shared/type';

export function Inspector({ instance }: { instance: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const exposedProps = getExposedProperties(instance);
  const [paramValues, setParamValues] = useState<Record<string, any>>({});

  const updateParam = (methodKey: string, paramName: string, value: any) => {
    setParamValues(prev => ({
      ...prev,
      [`${methodKey}.${paramName}`]: value,
    }));
  };

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


  return (
    <div className={`inspector-container ${isOpen ? 'open' : ''}`}>
      <IconButton
        className="close-inspector"
        onClick={() => console.log('close inspector')}
      >
        <DisabledByDefaultRoundedIcon />
      </IconButton>
      <h3>Inspector</h3>
      {exposedProps.map(({ key, kind, params, render }: ExposedMeta) => {
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
      })}
    </div>
  );
}
