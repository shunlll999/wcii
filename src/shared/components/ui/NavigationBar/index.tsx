import StringCompiler from '@Components/complier/StringCompiler';
import { withMetadata } from '@Shared/controllers/meta/withMatadata';
import type { Metadata } from '@Shared/controllers/meta/withMatadata.type';
import { getPresetByCode } from '@Shared/libs/present';
import { Fragment, useEffect, useState } from 'react';
import './navigation.css';

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
      const css = await fetch(`/assets/css/${meta.code}/index.css`).then(res => res.text());
      setCSSData(css);
      setReactData({ ...response });
      setLoading(false);
    };
    fetchData();
  }, [meta.code, meta.id]);

  console.log('meta', meta);

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div className='loading-container'  >
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" fill='var(--spinner-track)' opacity=".25"/>
            <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" fill="var(--spinner-arc)" className="spinner"/>
          </svg>
        </div>
      )}
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
