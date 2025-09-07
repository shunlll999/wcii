'use client';
import { Column, Container, NavigationBar } from '@Shared/components/ui';
import { positionStore } from '@Shared/stores/layoutStore';
import { PresetType } from '@Shared/types';
import { useEffect, useState } from 'react';
import './iframe.css';

const Preview = () => {
  const [layout, setLayout] = useState<PresetType[]>([]);
  const elementObject = (node: PresetType) => ({
    'text-code': <p>{node.props?.text?.toString() ?? <span>Editable Text ✏️</span>}</p>,
    'button-code': <button>Button</button>,
    'image-code': (
      <img
        width="100%"
        src="https://www.dpreview.com/files/p/articles/3912995929/Krobus-cat-sony-50-150-f2-gm.jpeg"
        alt="placeholder"
      />
    ),
    'container-code': <Container />,
    'column-code': <Column />,
    'navbar-code': <NavigationBar />,
  });

  const renderNode = (node: PresetType) => {
    return (
      <div key={node.sourceId}>
        {elementObject(node)[node.code as keyof typeof elementObject]}
      </div>
    );
  };

    useEffect(() => {
    const storedLayout = positionStore.getState().layouts;
    if (storedLayout.length > 0) {
      setLayout(storedLayout);
    }
  }, []);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
        {layout.map(n => renderNode(n))}
    </div>
  );
};

export default Preview;
