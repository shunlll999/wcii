import StringCompiler from '@Components/complier/StringCompiler';
import { withMetadata } from '@Shared/controllers/meta/withMatadata';
import type { Metadata } from '@Shared/controllers/meta/withMatadata.type';
import { getPresetByCode, getPresetStyleByCode } from '@Shared/libs/present';
import { Fragment, useEffect, useState } from 'react';
import './navigation.css';
import SpinLoader from '../spin';

export type Links ={
  title: string;
  href: string;
}

export interface NavigationPropsType {
  meta: Metadata
  linkProps?: Links[];
};

const NavigationBase: React.FC<{ meta: Metadata; linkProps?: Links[] }> = ({ meta, linkProps = [{ title: 'Home', href: '#' }, { title: 'About', href: '#' }, { title: 'Contact', href: '#' }], }: NavigationPropsType) => {
  const [reactData, setReactData] = useState<{ template: string; code: string; error?: string }>();
  const [cssData, setCSSData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [link, setLink] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getPresetByCode(meta.code, meta.id ?? 0);
      const { css } = await getPresetStyleByCode(meta.code);
      setCSSData(css);
      setReactData({ ...response });
      setLoading(false);
    };
    fetchData();
  }, [meta.code, meta.id]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <SpinLoader />}
      {reactData?.error && <div>Error: {reactData.error}</div>}
      {reactData?.template && (
        <StringCompiler
          source={reactData.template}
          styleSheet={cssData}
          cssScope="scoped"
          props={{
            className: {
              container: 'section-header',
              title: 'hero-title',
            },
            children: <Fragment>{link.map((item) => <li key={item.title}><a href={item.href}>{item.title}</a></li>)}</Fragment>,
            navigationLinks: linkProps,
          }}
          onMetadata={meta =>  {
            if (Array.isArray(meta?.props?.navigationLinks)) {
              setLink(meta.props.navigationLinks as Record<string, string>[]);
            } else {
              setLink([]);
            }
          }}
        />
      )}
    </div>
  );
};

NavigationBase.displayName = 'NavigationBar';

export const NavigationBar = withMetadata(NavigationBase, {
  name: 'NavigationBar',
  description: 'This is a Navigation Bar component',
  type: 'widget',
  id: 2,
  code: 'navbar-code',
  icon: 'CropSquareOutlinedIcon',
  props: {
    navigationLinks: { type: 'array', value: []},
  },
});
