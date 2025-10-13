/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import './inspect.css';
import React, { useContext, useEffect, useState } from 'react';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { IconButton } from '@mui/material';
import { BaseMessage } from '@Shared/modules/channel';
import { PresetAction } from '@Shared/types/dispatch.type';
import { BuilderContext } from '@Components/builder/contexts/builderContext';

export function Inspector({ instance }: { instance: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetData, setPresetData] = useState<BaseMessage | undefined>(undefined);

  //--------------- CHANNEL --------------- //
  const { channels } = useContext(BuilderContext);


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

  useEffect(() => {
    channels.INSPECTOR?.onMessage((message: BaseMessage) => {
      if (message.type === PresetAction.OPEN_INSPECTOR) {
        setIsOpen(true);
        setPresetData(message);
      }
    });
  }, []);

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
            value={value as string | number}
            onChange={e => propertyChange(e, key, value)}
          />
        </div>
      ))}
    </div>
  );
}
