'use client';
import * as React from 'react';
import { alpha, styled } from '@mui/material';
import { SimpleTreeView, TreeItem, treeItemClasses } from '@mui/x-tree-view';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import FormatShapesRoundedIcon from '@mui/icons-material/FormatShapesRounded';
import PhotoSizeSelectActualRoundedIcon from '@mui/icons-material/PhotoSizeSelectActualRounded';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import { navigationController, PresetAction } from '@Controllers/navigation.controller';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

function ExpandIcon(props: React.PropsWithoutRef<typeof AddBoxRoundedIcon>) {
  return <KeyboardArrowRightRoundedIcon {...props} sx={{ opacity: 0.6 }} />;
}

function CollapseIcon(
  props: React.PropsWithoutRef<typeof IndeterminateCheckBoxRoundedIcon>,
) {
  return <KeyboardArrowDownRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function EndIcon(props: React.PropsWithoutRef<typeof DisabledByDefaultRoundedIcon>) {
  return <TagRoundedIcon {...props} sx={{ opacity: 0.3, transform: 'scale(0.5)' }} />;
}

function TextIconLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

export const Navigation = () => {
  return (
    <div>
      <SimpleTreeView
      aria-label="customized"
      defaultExpandedItems={['1', '3']}
      slots={{
        expandIcon: ExpandIcon,
        collapseIcon: CollapseIcon,
        endIcon: EndIcon,
      }}
      sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
    >
      <CustomTreeItem itemId="1" label="Main">
        <CustomTreeItem itemId="2" label="Hello" />
        <CustomTreeItem itemId="3" label="Subtree with children">
          <CustomTreeItem itemId="6" label="Hello" />
          <CustomTreeItem itemId="7" label="Sub-subtree with children">
            <CustomTreeItem itemId="9" label="Child 1" />
            <CustomTreeItem itemId="10" label="Child 2" />
            <TreeItem itemId="11" label={<TextIconLabel icon={<PhotoSizeSelectActualRoundedIcon sx={{ transform: 'scale(0.6)' }} />} text="Image" />} />
            <TreeItem itemId="12" label={<TextIconLabel icon={<FormatShapesRoundedIcon  sx={{ transform: 'scale(0.6)' }} />} text="Text" />} onClick={() => navigationController.addPreset('text', PresetAction.ADD)} />
          </CustomTreeItem>
          <CustomTreeItem itemId="8" label="Hello" />
        </CustomTreeItem>
        <CustomTreeItem itemId="4" label="World" />
        <CustomTreeItem itemId="5" label="Something something" />
      </CustomTreeItem>
    </SimpleTreeView>
    </div>
  );
};
