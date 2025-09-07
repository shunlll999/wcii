import { Metadata } from "./withMatadata.type";

export function withMetadata<P>(
  Comp: React.ComponentType<P & { meta: Metadata }>,
  meta: Metadata
) {
  const Wrapped: React.FC<P> & { metadata: Metadata } = (props) => (
    <Comp {...props} meta={meta} />
  );
  Wrapped.metadata = meta;
  Wrapped.displayName = `WithMeta(${Comp.displayName || Comp.name || 'Component'})`;
  return Wrapped;
}
