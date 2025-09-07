import StringCompiler from '@Components/complier/StringCompiler';
import { v4 as uuid } from 'uuid';
import { withMetadata } from '@Shared/controllers/meta/withMatadata';
import type { Metadata } from '@Shared/controllers/meta/withMatadata.type';
import { getPresetByCode } from '@Shared/libs/present';
import { useEffect, useState } from 'react';

const NavigationBase: React.FC<{ meta: Metadata }> = ({ meta }: { meta: Metadata }) => {
  const [reactData, setReactData] = useState<{ template: string; code: string; error?: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [srouceId, setUuid] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getPresetByCode(meta.code, meta.id ?? 0);
      setReactData({ ...response });
      setLoading(false);
      setUuid(uuid());
    };
    fetchData();
  }, [meta.code, meta.id]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Loading...
        </div>
      )}
      {/* {reactData?.error && <div>Error: {reactData.error}</div>}
      {reactData?.template && (
        <StringCompiler
          source={reactData.template}
          props={{
            className: {
              container: 'section-header',
              paragraph: 'section-content',
            },
            children: <div >Hello this is a Navigation Bar {srouceId}</div>,
          }}
          onMetadata={meta => {
            console.log('onMetadata', meta);
          }}
        />
      )} */}
      <div style={{ background: 'var(--background)', color: 'var(--foreground)', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>wciB</h2>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', gap: '10px' }}>
          <li style={{ cursor: 'pointer' }}>Home</li>
          <li style={{ cursor: 'pointer' }}>About</li>
          <li style={{ cursor: 'pointer' }}>Services</li>
          <li style={{ cursor: 'pointer' }}>Contact</li>
        </ul>
      </div>
    </div>
  );
};

NavigationBase.displayName = 'Column';

export const NavigationBar = withMetadata(NavigationBase, {
  name: 'NavigationBar',
  description: 'This is a Navigation Bar component',
  type: 'widget',
  id: 2,
  code: 'navbar-code',
  icon: 'CropSquareOutlinedIcon',
});
