/* eslint-disable @next/next/no-img-element */
'use client';
import type { PresetType } from '@Shared/types';
import { v4 as uuid } from 'uuid';
import React, { useEffect, useRef, useState } from 'react';
import './iframe.css';

export default function IframeCanvasPage() {
  const [layout, setLayout] = useState<PresetType[]>([]);
  const dragOverNode = useRef<string | null>(null);
  const dragPosition = useRef<'before' | 'after' | 'inside' | null>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const hoverNodeRef = useRef<HTMLElement | null>(null);

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

  const onDragOver = (e: DragEvent) => {
    const dropzone = dropzoneRef.current!;
    e.preventDefault();
    const target = (e.target as HTMLElement)?.closest('.node');

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
    const position = e.clientY < midY ? 'before' : 'after';
    setHighlightNode(target as HTMLElement, position);
  };

  const onDragLeave = (e: DragEvent) => {
    const dropzone = dropzoneRef.current!;
    if (!dropzone.contains(e.relatedTarget as Node)) {
      clearHighlight();
    }
  };

  // ------------------------ RENDER NODE ------------------------ //

  const onMoveElement = (event: React.DragEvent<HTMLDivElement>, node: PresetType) => {
    console.log(dragPosition.current);
    event.dataTransfer.setData(
      'application/x-builder',
      JSON.stringify({ sourceId: node.sourceId })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOverElement = (event: React.DragEvent<HTMLDivElement>, node: PresetType) => {
    event.preventDefault();
    dragOverNode.current = node.sourceId ?? null;
  };


  const renderNode = (node: PresetType, parentId?: string) => {
    const isHighlighted = dragOverNode.current === node.sourceId;
    return (
      <div
        key={node.sourceId}
        data-source-id={`node ${isHighlighted ? `highlight-${dragPosition.current}` : ''}`}
        className={`node ${isHighlighted ? `highlight-${dragPosition.current}` : ''}`}
        draggable
        onDragStart={e => onMoveElement(e, node)}
        onDragOver={e => onDragOverElement(e, node)}
        onDrop={e => onDrop(e, parentId, node.sourceId, dragPosition.current ?? 'before')}
      >
        {/* Node content */}
        {node.code === 'text-code' && (
          <p>{node.props?.text?.toString() ?? <span>Editable Text ✏️</span>}</p>
        )}
        {node.code === 'button-code' && <button>Button</button>}
        {node.code === 'image-code' && (
          <img
            width="100%"
            src="https://www.dpreview.com/files/p/articles/3912995929/Krobus-cat-sony-50-150-f2-gm.jpeg"
            alt="placeholder"
          />
        )}
        {node.code === 'container-code' && (
          <div
            className="node"
            style={{ background: 'blue' }}
            onDrop={e => onDrop(e, node.sourceId, undefined, dragPosition.current ?? 'inside')}
          >
            {node.children?.map(c => renderNode(c, node.sourceId))}
          </div>
        )}
      </div>
    );
  };

  // ------------------------ DROP HANDLER ------------------------ //

  const onDrop = (
    e: React.DragEvent<HTMLDivElement>,
    parentId?: string,
    targetId?: string,
    position: 'before' | 'after' | 'inside' = 'inside'
  ) => {
    e.preventDefault();
    const raw = e.dataTransfer?.getData('application/x-builder');
    if (!raw) return;

    const payload: PresetType = JSON.parse(raw);

    setLayout(prevLayout => {
      let newLayout = [...prevLayout];

      console.log('payload.sourceId', payload.sourceId);

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

    clearHighlight();
  };

  console.log('layout', layout);

  // ------------------------ BIND EVENTS ------------------------ //
  useEffect(() => {
    const dropzone = dropzoneRef.current!;
    if (!dropzone) return;

    dropzone.addEventListener('dragover', onDragOver);
    dropzone.addEventListener('drop', (e: DragEvent) =>
      onDrop(e as unknown as React.DragEvent<HTMLDivElement>)
    );
    dropzone.addEventListener('dragleave', onDragLeave);

    return () => {
      dropzone.removeEventListener('dragover', onDragOver);
      dropzone.removeEventListener('drop', (e: DragEvent) =>
        onDrop(e as unknown as React.DragEvent<HTMLDivElement>)
      );
      dropzone.removeEventListener('dragleave', onDragLeave);
    };
  }, []);

  return (
    <div className="canvas">
      <div id="dropzone" ref={dropzoneRef} className="g-drop-target" data-accept="*">
        {layout.map(n => renderNode(n))}
      </div>
    </div>
  );
}
