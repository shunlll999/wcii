import { PresetResponseType } from "@Shared/types";

type NavigationProps = {
  presets: PresetResponseType;
}
export const Navigation = ({ presets }: NavigationProps) => {
const { data } = presets
  return <div>{data.map(item => <div key={item.id}>{item.name}</div>)}</div>;
};
