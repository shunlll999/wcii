/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import './inspect.css';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import {
  Button,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import { BaseMessage } from '@Shared/modules/channel';
import { PresetAction } from '@Shared/types/dispatch.type';
import { BuilderContext } from '@Components/builder/contexts/builderContext';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { PresetType } from '@Shared/types';

export function Inspector({ instance }: { instance: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetData, setPresetData] = useState<BaseMessage | undefined>(undefined);
  const [openProps, setOpenProps] = useState(false);

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

  const handleClick = () => {
    setOpenProps(!openProps);
  };

  console.log('presetData?.payload', presetData?.payload);

  const propsRenderSettings = (
    key: string,
    value: string | number | Record<string, unknown> | boolean | PresetType[]
  ): { [key: string]: React.ReactNode } => {
    console.log('value', value);
    const { name, description, props } = value as Record<string, unknown>;
    console.log('props', props);
    return {
      id: (
        <TextField size="small" fullWidth label={key} variant="outlined" value={value} disabled />
      ),
      metadata: (
        <Fragment>
          <TextField size="small" fullWidth label="Name" variant="outlined" defaultValue={name} />
          <TextField
            size="small"
            fullWidth
            label="Description"
            style={{ marginTop: '14px' }}
            variant="outlined"
            defaultValue={description}
          />
          {Object.entries(props || {}).map(([propKey, propValue]) => {
            const { type, value } = propValue as Record<string, unknown>;
            return (
              // <TextField
              //   key={propKey}
              //   size="small"
              //   fullWidth
              //   label={type ? `${propKey} (${type as string})` : propKey}
              //   style={{ marginTop: '14px' }}
              //   variant="outlined"
              //   defaultValue={propValue as string}
              // />
              <div key={propKey} className="inspector-item-list">
                {/* <label>{type ? `${propKey} (${type as string})` : propKey}:</label>
          <input
            type={typeof propValue === 'number' ? 'number' : 'text'}
            defaultValue={propValue as string | number}
            onChange={e => propertyChange(e, propKey, propValue)}
          /> */}
                <ListItemButton onClick={handleClick}>
                  <ListItemIcon>
                   <InsertLinkIcon />
                  </ListItemIcon>
                  <ListItemText primary={propKey} />
                  {openProps ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openProps} timeout="auto" unmountOnExit>
                  {(type as string) === 'array' ? (value as any[]).map((item: any, index: number) => (
                    <List key={index} component="div" disablePadding>
                      <ListItemButton>
                        <ListItemText primary={item.title} />
                        <ModeEditIcon  />
                      </ListItemButton>
                    </List>
                  )) : <div>XXX</div>}
                  <Button variant="outlined" size="small" style={{ marginTop: '8px' }} fullWidth>
                  <AddLinkIcon />
                  <div style={{ marginLeft: '8px' }}>Add {propKey}</div>

                </Button>
                </Collapse>
              </div>
            );
          })}
        </Fragment>
      ),
      variant: 'outlined',
      size: 'small',
    };
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
      <div>
        {Object.entries(presetData?.payload ?? {}).map(([key, value]) => (
          <div key={key} className="props-list">
            <div className="props-items">{propsRenderSettings(key, value)[key]}</div>
            {/* <label>{key}: </label> */}
            {/* <input
            type={typeof value === 'number' ? 'number' : 'text'}
            value={value as string | number}
            onChange={e => propertyChange(e, key, value)}
          /> */}
          </div>
        ))}
      </div>
    </div>
  );
}
