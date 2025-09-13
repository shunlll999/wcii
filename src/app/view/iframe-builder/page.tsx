/* eslint-disable @next/next/no-img-element */
'use client';
import type { PresetType } from '@Shared/types';
import { v4 as uuid } from 'uuid';
import React, {  useEffect, useRef, useState } from 'react';
import './iframe.css';
import {
  BaseMessage,
  createSecureChannel,
  SecureChannelTypeWithRequiredPayload,
} from '@Shared/modules/channel';
import { CHANNEL_NAME } from '@Shared/constants';
import { Column, Container, NavigationBar, NavigationPropsType } from '@Shared/components/ui';
import { positionStore } from '@Shared/stores/layoutStore';

export default function IframeCanvasPage() {
  const [layout, setLayout] = useState<PresetType[]>([]);
  const dragOverNode = useRef<string | null>(null);
  const dragPosition = useRef<'before' | 'after' | 'inside' | null>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const hoverNodeRef = useRef<HTMLElement | null>(null);

  // ------------------------ CHANNEL ------------------------ //
  const navigationChannelRef = useRef<
    Record<string, SecureChannelTypeWithRequiredPayload | undefined>
  >({});

  // ------------------------ UTILITIES ------------------------ //

  const findNodePath = (
    nodes: PresetType[],
    id: string,
    path: (number | 'children')[] = []
  ): (number | 'children')[] | null => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.sourceId === id) return [...path, i];
      if (node.children) {
        const childrenPath = findNodePath(node.children, id, [...path, 'children']);
        if (childrenPath) return childrenPath;
      }
    }
    return null;
  };

  const getNodeByPath = (nodes: PresetType[], path: (number | 'children')[]): PresetType | null => {
    let current: PresetType | null = null;
    let arr = nodes;
    for (const idx of path) {
      current = arr[idx as number];
      if (!current) return null;
      arr = current.children ?? [];
    }
    return current;
  };

  const setNodeByPath = (
    nodes: PresetType[],
    path: (number | 'children')[],
    value: PresetType | null
  ): PresetType[] => {
    const nodeCopy = [...nodes];
    if (path.length === 1 && typeof path[0] === 'number') {
      if (value) nodeCopy[path[0]] = value;
      else nodeCopy.splice(path[0], 1);
      return nodeCopy;
    }
    const [first, ...rest] = path;
    if (typeof first === 'number') {
      nodeCopy[first] = {
        ...nodeCopy[first],
        children: setNodeByPath(nodeCopy[first].children || [], rest, value),
      };
    }
    return nodeCopy;
  };

  // ------------------------ HIGHLIGHT HANDLER ------------------------ //

  const allPositionClasses = ['g-insert-before', 'g-insert-after'];

  const clearHighlight = () => {
    if (hoverNodeRef.current) {
      hoverNodeRef.current.classList.remove(...allPositionClasses);
      hoverNodeRef.current = null;
    }
    dropzoneRef.current?.classList.remove('g-hover');
    dragOverNode.current = null;
  };

  const setHighlightNode = (el: HTMLElement, position: 'before' | 'after') => {
    const allPositionClasses = ['g-insert-before', 'g-insert-after'];
    if (hoverNodeRef.current && hoverNodeRef.current !== el) {
      hoverNodeRef.current.classList.remove(...allPositionClasses);
    }
    hoverNodeRef.current = el;
    dragPosition.current = position;
    const targetClass = `g-insert-${position}`;
    el.classList.remove(...allPositionClasses);
    el.classList.add(targetClass);
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();              // ✅ ต้องมีเพื่อให้ drop ได้
    const dt = event.dataTransfer;
    if (!dt) return;                 // ✅ guard กัน null
    dt.dropEffect = 'move';
    const dropzone = dropzoneRef.current!;
    const target = (event.target as HTMLElement)?.closest('.node');

    if (!target || !dropzone.contains(target)) {
      if (!dropzone.classList.contains('g-hover')) {
        dropzone.classList.add('g-hover');
      }
      if (hoverNodeRef.current) {
        hoverNodeRef.current.classList.remove('g-insert-before', 'g-insert-after');
        hoverNodeRef.current = null;
        // dragOverNode.current = null;
      }
      return;
    }

    dropzone.classList.remove('g-hover');
    const rect = target.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = event.clientY < midY ? 'before' : 'after';
    setHighlightNode(target as HTMLElement, position);
  };

  const onDragLeave = (e: DragEvent) => {
    const dropzone = dropzoneRef.current!;
    if (!dropzone.contains(e.relatedTarget as Node)) {
      clearHighlight();
    }
  };

  // ------------------------ RENDER NODE ------------------------ //

  const onMoveElement = (event: DragEvent, node: PresetType) => {
    const dt = event.dataTransfer;
    if (!dt) return;
    dt.effectAllowed = 'move';
    event.dataTransfer.setData(
      'application/x-builder',
      JSON.stringify({ sourceId: node.sourceId })
    );

    // ปรับ drag image ให้โปร่งใสเล็กน้อย (optional)
    const crt = (event.currentTarget as Element)?.cloneNode(true) as HTMLDivElement;
    crt.style.pointerEvents = 'none';
    crt.style.position = 'absolute';
    crt.style.top = '-99999px';
    crt.style.opacity = '0.5';
    crt.style.transform = 'scale(0.99)';
    crt.style.width = '150px';
    crt.style.height = '100px';
    crt.style.textAlign = 'center';
    crt.style.display = 'flex';
    crt.style.alignItems = 'center';
    crt.style.justifyContent = 'center';
    // Backdrop blur (Chrome/Edge/Firefox ใหม่ ๆ)
    crt.style.backdropFilter = 'blur(20px)';
    // Safari
    crt.style.setProperty('-webkit-backdrop-filter', 'blur(20px)');
    document.body.appendChild(crt);
    event.dataTransfer.setDragImage(crt, crt.offsetWidth / 2, crt.offsetHeight / 2);
    // cleanup ทันทีหลัง browser snapshot แล้ว
    setTimeout(() => document.body.removeChild(crt), 0);
  };

  const onDragOverElement = (event: DragEvent, node: PresetType) => {
    event.preventDefault();
    const dt = event.dataTransfer;
    if (!dt) return;                 // ✅ guard กัน null
    dt.dropEffect = 'move';
    dragOverNode.current = node.sourceId ?? null;
  };
  // ------------------------ DROP HANDLER ------------------------ //

  const onDrop = (
    event: DragEvent,
    parentId?: string,
    targetId?: string,
    position: 'before' | 'after' | 'inside' = 'inside'
  ) => {
    event.preventDefault();
    const raw = event.dataTransfer?.getData('application/x-builder');
    if (!raw) return;

    const payload: PresetType = JSON.parse(raw);
    clearHighlight();
    setLayout(prevLayout => {
      let newLayout = [...prevLayout];

      // CASE 1: Reorder existing node
      if (payload.sourceId) {
        const sourcePath = findNodePath(newLayout, payload.sourceId);
        if (!sourcePath) return newLayout;

        const sourceNode = getNodeByPath(newLayout, sourcePath);
        if (!sourceNode) return newLayout;

        newLayout = setNodeByPath(newLayout, sourcePath, null);

        const parentPath = parentId ? findNodePath(newLayout, parentId) : [];
        const targetArray = parentPath
          ? (getNodeByPath(newLayout, parentPath)?.children ?? newLayout)
          : newLayout;

        let insertIndex = targetArray.length;
        if (targetId) {
          const idx = targetArray.findIndex(n => n.sourceId === targetId);
          if (idx !== -1) insertIndex = position === 'before' ? idx : idx + 1;
        }

        targetArray.splice(insertIndex, 0, sourceNode);
        // dragOverNode.current = null;
        return [...newLayout];
      }
      // CASE 2: Insert new node from sidebar preset
      const newNode: PresetType = {
        ...payload,
        metadata: [{ name: payload.name, value: payload.code }],
        sourceId: uuid(),
        children: payload.code === 'container-code' ? [] : undefined,
      };

      const parentPath = parentId ? findNodePath(newLayout, parentId) : [];
      const targetArray = parentPath
        ? (getNodeByPath(newLayout, parentPath)?.children ?? newLayout)
        : newLayout;

      let insertIndex = targetArray.length;
      if (targetId) {
        const idx = targetArray.findIndex(n => n.sourceId === targetId);
        if (idx !== -1) insertIndex = position === 'before' ? idx : idx + 1;
      }

      targetArray.splice(insertIndex, 0, newNode);
      // dragOverNode.current = null;
      return [...newLayout];
    });
  };

  const onSignalAddElement = (node: PresetType) => {
    console.log('onSignalAddElement', node);
    positionStore.getState().setLayout([...layout, { ...node, sourceId: uuid() }]);
    setLayout(prevLayout => [...prevLayout, { ...node, sourceId: uuid() }]);
  };

  // ------------------------ BIND EVENTS ------------------------ //
  useEffect(() => {
    const dropzone = dropzoneRef.current!;
    if (!dropzone) return;

    const abortController = new AbortController();
    const { signal } = abortController;

    dropzone.addEventListener('dragover', onDragOver, { signal });
    dropzone.addEventListener('drop', onDrop, { signal });
    dropzone.addEventListener('dragleave', onDragLeave, { signal });

    const navigationChannel = createSecureChannel(
      CHANNEL_NAME.NAVIGATION,
      (message: BaseMessage) => {
        console.log('view', message);
        onSignalAddElement(message.payload);
      }
    );

    navigationChannelRef.current.navigation = navigationChannel;

    return () => {
      navigationChannel?.close();
      delete navigationChannelRef.current.navigation;

      abortController.abort();

      dropzone.removeEventListener('dragover', onDragOver);
      dropzone.removeEventListener('drop', onDrop);
      dropzone.removeEventListener('dragleave', onDragLeave);
    };
  }, []);

  useEffect(() => {
    if (layout.length === 0) return;
    positionStore.getState().setLayout(layout);
  }, [layout]);

  useEffect(() => {
    const storedLayout = positionStore.getState().layouts;
    if (storedLayout.length > 0) {
      setLayout(storedLayout);
    }
  }, []);

  const links: NavigationPropsType['linkProps'] = [
    { title: 'Home', href: '#' },
    { title: 'About', href: '#' },
    { title: 'ContactAAA', href: '#' }
  ];

  const NavigationMeta = NavigationBar.metadata

  const elementObject = (node: PresetType) => ({
    'text-code':  <p>{node.props?.text?.toString() ?? <span>Editable Text ✏️</span>}</p>,
    'button-code': <button>Button</button>,
    'image-code': <img width="100%" src="https://www.dpreview.com/files/p/articles/3912995929/Krobus-cat-sony-50-150-f2-gm.jpeg" alt="placeholder" />,
    // 'container-code': <div
    //         className="node"
    //         style={{ background: 'blue' }}
    //         onDrop={(e) => onDrop(e as unknown as DragEvent, node.sourceId, undefined, dragPosition.current ?? 'inside')}
    //       >
    //         {node.children?.map(c => renderNode(c, node.sourceId))}
    //       </div>
    'container-code': <Container />,
    'column-code': <Column />,
    'navbar-code': <NavigationBar meta={NavigationMeta} linkProps={links} />

  })


  const renderNode = (node: PresetType, parentId?: string) => {
    const isHighlighted = dragOverNode.current === node.sourceId;
    return (
      <div
        key={node.sourceId}
        data-source-id={`node ${isHighlighted ? `highlight-${dragPosition.current}` : ''}`}
        className={`node ${isHighlighted ? `highlight-${dragPosition.current}` : ''}`}
        draggable
        onDragStart={(e) => onMoveElement(e as unknown as DragEvent, node)}
        onDragOver={(e) => onDragOverElement(e as unknown as DragEvent, node)}
        onDrop={(e) => onDrop(e as unknown as DragEvent, parentId, node.sourceId, dragPosition.current ?? 'before')}
      >
        {/* Node content */}
        {elementObject(node)[node.code as keyof typeof elementObject]}
      </div>
    );
  };

  return (
    <div className="canvas">
      <div id="dropzone" ref={dropzoneRef} className="g-drop-target" data-accept="*">
        {layout.map(n => renderNode(n))}
      </div>
    </div>
  );
}
