import { Metadata } from "@Shared/controllers/meta/withMatadata.type";
import { PresetType } from "@Shared/types";
import { PresetAction } from "@Shared/types/dispatch.type";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { BuilderContext } from "../contexts/builderContext";

type LayoutNode = {
  children: React.ReactNode,
  mapData: {
    meta: Metadata,
    data: unknown,
    propName: string,
    node: PresetType,
  },
};

function getTagName(value: unknown) {
  return Object.prototype.toString.call(value).replace(/^\[object |\]$/g, "").toLocaleLowerCase();
}

// สมมติว่ามี type แบบนี้
type ElementControlProps = LayoutNode;
export type ElementControlHandle = {
  onWidgetAction: () => void;
  onActiveNode: (value: boolean) => void;
};


export const ElementControl = forwardRef<ElementControlHandle, ElementControlProps>(
  ({ children, mapData }, ref) => {
    //--------------- CHANNEL --------------- //
    const { channels } = useContext(BuilderContext);
    const [activeNode, setActiveNode] = useState<boolean>(false);

    // ฟังก์ชันที่จะ expose ออกไป
    const onWidgetAction = () => {
      const { data, meta, propName, node } = mapData;

      const propsData = {
        type: getTagName(data),
        value: data
      };

      const newMeta = {
        ...meta,
        props: {
          [propName]: propsData
        }
      };

      const applyNode = {
        ...node,
        metadata: newMeta,
        props: {
          ...node.props,
          [propName]: propsData
        }
      };

      channels.INSPECTOR?.send(
        newMeta.name,
        PresetAction.OPEN_INSPECTOR,
        applyNode
      );
    };

    const onActiveNode = (value: boolean) => {
      setActiveNode(value)
    }

    // expose method ให้ parent เรียกได้ผ่าน ref
    useImperativeHandle(ref, () => ({
      onWidgetAction,
      onActiveNode
    }));

    return (
      <div className={activeNode ? 'node-action' : ''} onClick={onWidgetAction}>
        {children}
      </div>
    );
  }
);

ElementControl.displayName = 'ElementControl';
