'use client';
import CropSquareOutlinedIcon from '@mui/icons-material/CropSquareOutlined';
import ViewArrayOutlinedIcon from '@mui/icons-material/ViewArrayOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import RttOutlinedIcon from '@mui/icons-material/RttOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import TextRotationNoneOutlinedIcon from '@mui/icons-material/TextRotationNoneOutlined';
import PinOutlinedIcon from '@mui/icons-material/PinOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import CommentBankOutlinedIcon from '@mui/icons-material/CommentBankOutlined';
import ArtTrackOutlinedIcon from '@mui/icons-material/ArtTrackOutlined';
import { PresetResponseType, PresetType } from '@Shared/types';
import styles from './navigation.module.css';
import React, { useContext, useState } from 'react';
import { PresetAction } from '@Shared/types/dispatch.type';
import { Metadata } from '@Shared/controllers/meta/withMatadata.type';
import { withMetadata } from '@Shared/controllers/meta/withMatadata';
import classname from 'classnames';
import { useLayout } from '@Shared/hooks/useLayout';
import pkg from '../../../../package.json';
import { BuilderContext } from '../contexts/builderContext';

type NavigationProps = {
  presets: PresetResponseType;
};

type NavigationMetaDataType = NavigationProps & { meta: Metadata };

const NavigationBase: React.FC<NavigationMetaDataType> = ({
  presets,
  meta,
}: NavigationMetaDataType) => {
  const { data } = presets;
  const [isBasicOpen, setIsBasicOpen] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState<string>('');
  const [isExtraOpen, setIsExtraOpen] = useState<string>('');
  const hierarchies = useLayout();

  const { channels } = useContext(BuilderContext);

  const onSelectedCode = async (data: PresetType) => {
    channels.NAVIGATION?.send(meta.name, PresetAction.ADD, data);
  };

  const icon = {
    CropSquareOutlinedIcon: <CropSquareOutlinedIcon fontSize="large" />,
    ViewArrayOutlinedIcon: <ViewArrayOutlinedIcon fontSize="large" />,
    TextFieldsOutlinedIcon: <TextFieldsOutlinedIcon fontSize="large" />,
    ImageRoundedIcon: <ImageRoundedIcon fontSize="large" />,
    TitleOutlinedIcon: <TitleOutlinedIcon fontSize="large" />,
    LinkOutlinedIcon: <LinkOutlinedIcon fontSize="large" />,
    OndemandVideoOutlinedIcon: <OndemandVideoOutlinedIcon fontSize="large" />,
    ViewListOutlinedIcon: <ViewListOutlinedIcon fontSize="large" />,
    RttOutlinedIcon: <RttOutlinedIcon fontSize="large" />,
    PlaylistAddCheckOutlinedIcon: <PlaylistAddCheckOutlinedIcon fontSize="large" />,
    TextRotationNoneOutlinedIcon: <TextRotationNoneOutlinedIcon fontSize="large" />,
    PinOutlinedIcon: <PinOutlinedIcon fontSize="large" />,
    CheckBoxOutlinedIcon: <CheckBoxOutlinedIcon fontSize="large" />,
    RadioButtonCheckedOutlinedIcon: <RadioButtonCheckedOutlinedIcon fontSize="large" />,
    CommentBankOutlinedIcon: <CommentBankOutlinedIcon fontSize="large" />,
    ArtTrackOutlinedIcon: <ArtTrackOutlinedIcon fontSize="large" />,
  } as { [key: string]: React.ReactNode };

  const onSectionController = (key: string) => {
    switch (key) {
      case 'basic':
        setIsBasicOpen(isBasicOpen === '' ? 'open' : '');
        setIsFormOpen('');
        setIsExtraOpen('');
        break;
      case 'form':
        setIsFormOpen(isFormOpen === 'open' ? '' : 'open');
        setIsBasicOpen('');
        setIsExtraOpen('');
        break;
      case 'extra':
        setIsExtraOpen(isExtraOpen === 'open' ? '' : 'open');
        setIsFormOpen('');
        setIsBasicOpen('');
        break;
      default:
        break;
    }
  };

  const mapKeys = {
    basic: isBasicOpen,
    form: isFormOpen,
    extra: isExtraOpen,
  } as const;

  return (
    <div className={styles.nav}>
      <div className={styles['section-hierarchy']}>
        <div className={styles['section-header']}>Hierarchy</div>
        <ul className={styles['section-hierarchy-list']}>
          {hierarchies.map(item => (
            <li key={item.sourceId}>{item.name}</li>
          ))}
        </ul>
      </div>
      <div>
        {data &&
          Object.entries(data)
            .sort(([, a], [, b]) => a.seq - b.seq)
            .map(([key, item]) => (
              <div key={key}>
                <div
                  className={styles['section-header']}
                  onClick={() => onSectionController(key.toLocaleLowerCase())}
                >
                  {key}
                </div>
                <div
                  className={classname(
                    styles['section-item'],
                    styles['section-controller'],
                    styles[
                      `${key.toLocaleLowerCase()}-${mapKeys[key.toLocaleLowerCase() as keyof typeof mapKeys]}`
                    ]
                  )}
                >
                  {item.data.map(data => {
                    return (
                      <div
                        key={data.id}
                        className={styles['section-content']}
                        onClick={() => onSelectedCode(data)}
                      >
                        <div>
                          <div>{icon[data?.icon || 'CropSquareOutlinedIcon']}</div>
                          <div>{data.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
      </div>
      <div>
        <div
          className={styles['section-version']}
        >{`:: ${pkg.name} version ${pkg.version} :: ${pkg.phase}`}</div>
      </div>
    </div>
  );
};

export const Navigation = withMetadata(NavigationBase, {
  name: 'Navigation',
  description: 'This is a Navigation component',
  type: 'base',
  icon: 'ViewListOutlinedIcon',
  code: 'none-code',
});
