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
import { getPresetByCode } from '@Shared/libs/present';
import React, { useState } from 'react';
import StringCompiler from '@Components/complier/StringCompiler';
import { Box, Modal, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type NavigationProps = {
  presets: PresetResponseType;
};
export const Navigation = ({ presets }: NavigationProps) => {
  const { data } = presets;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reactData, setReactData] = useState<{ template: string; code: string; error?: string }>({
    template: '',
    code: '',
    error: '',
  });
  const onSelectedCode = async (data: PresetType) => {
    const response = await getPresetByCode(data.code, data.id);
    console.log(response);
    if (response.error) {
      setIsModalOpen(true);
      setReactData({ ...response });
    } else {
      setReactData({ ...response });
    }
  };

  const icon = {
    'CropSquareOutlinedIcon': <CropSquareOutlinedIcon fontSize='large' />,
    'ViewArrayOutlinedIcon': <ViewArrayOutlinedIcon fontSize='large' />,
    'TextFieldsOutlinedIcon': <TextFieldsOutlinedIcon fontSize='large' />,
    'ImageRoundedIcon': <ImageRoundedIcon fontSize='large' />,
    'TitleOutlinedIcon': <TitleOutlinedIcon fontSize='large' />,
    'LinkOutlinedIcon': <LinkOutlinedIcon fontSize='large' />,
    'OndemandVideoOutlinedIcon': <OndemandVideoOutlinedIcon fontSize='large' />,
    'ViewListOutlinedIcon': <ViewListOutlinedIcon fontSize='large' />,
    'RttOutlinedIcon': <RttOutlinedIcon fontSize='large' />,
    'PlaylistAddCheckOutlinedIcon': <PlaylistAddCheckOutlinedIcon fontSize='large' />,
    'TextRotationNoneOutlinedIcon': <TextRotationNoneOutlinedIcon fontSize='large' />,
    'PinOutlinedIcon': <PinOutlinedIcon fontSize='large' />,
    'CheckBoxOutlinedIcon': <CheckBoxOutlinedIcon fontSize='large' />,
    'RadioButtonCheckedOutlinedIcon': <RadioButtonCheckedOutlinedIcon fontSize='large' />,
    'CommentBankOutlinedIcon': <CommentBankOutlinedIcon fontSize='large' />,
    'ArtTrackOutlinedIcon': <ArtTrackOutlinedIcon fontSize='large' />,
  } as { [key: string]: React.ReactNode };

  return (
    <div className={styles.nav}>
      <div>
        <div className={styles['section-header']}>Hierarchy</div>
        <div className={styles['section-content']}>Item 1</div>
      </div>
      <div>
        {data &&
          Object.entries(data)
            .sort(([, a], [, b]) => a.seq - b.seq)
            .map(([key, item]) => (
              <div key={key}>
                <div className={styles['section-header']}>{key}</div>
                <div className={styles['section-item']}>
                  {item.data.map(data => {
                    return (
                      <div
                      draggable
                        key={data.id}
                        className={styles['section-content']}
                        onClick={() => onSelectedCode(data)}
                      >
                        <div>
                        <div>{icon[data?.icon || 'CropSquareOutlinedIcon']}</div>
                        <div>
                        {data.name}
                        </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
      </div>
      {reactData.template && (
        <StringCompiler
          source={reactData.template}
          props={{
            className: {
              container: styles['section-header'],
              paragraph: styles['section-content'],
            },
            children: reactData.code,
          }}
        />
      )}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="red">
            Error
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {reactData.error}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};
