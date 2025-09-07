import StringCompiler from "@Components/complier/StringCompiler";
import { v4 as uuid } from 'uuid'
import { withMetadata } from "@Shared/controllers/meta/withMatadata";
import type { Metadata } from "@Shared/controllers/meta/withMatadata.type";
import { getPresetByCode } from "@Shared/libs/present";
import { useEffect, useState } from "react";

const ColumnBase: React.FC<{ meta: Metadata }> = ({ meta }: { meta: Metadata }) => {
  const [reactData, setReactData] = useState<{ template: string; code: string; error?: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [srouceId, setUuid] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getPresetByCode(meta.code, meta.id ?? 0);
      setReactData({ ...response })
      setLoading(false);
      setUuid(uuid());
    };
    fetchData();
  }, [meta.code, meta.id]);


  return (
  <div style={{ position: 'relative' }}>
    {loading && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>}
    {reactData?.error && <div>Error: {reactData.error}</div>}
    {reactData?.template && (
      <StringCompiler
        source={reactData.template}
        props={{
          className: {
            container: 'section-header',
            paragraph: 'section-content',
          },
          children: <div style={{ background: 'blue' }}>Hello this is a container {srouceId}</div>
        }}
      />
    )}
  </div>
)}

ColumnBase.displayName = "Column";

export const Column = withMetadata(ColumnBase, {
  name: 'Column',
  description: 'This is a Column component',
  type: 'widget',
  id: 2,
  code: 'column-code',
  icon: 'CropSquareOutlinedIcon',
});
