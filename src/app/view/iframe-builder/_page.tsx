'use client';
import { PresetType } from '@Shared/types';
import { v4 as uuid } from 'uuid';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import './iframe.css';

export default function DragDropHighlightAnimated() {
  const [items, setItems] = useState<PresetType[]>([
    {
      id: 3,
      name: 'Text',
      description: 'This is a preset for Text',
      code: 'text-code',
      props: {},
      metadata: [],
      children: [],
      icon: 'TitleOutlinedIcon',
      sourceId: uuid(),
    },
    {
      id: 4,
      name: 'Image',
      description: 'This is a preset for Image',
      code: 'image-code',
      props: {},
      metadata: [],
      children: [],
      icon: 'ImageRoundedIcon',
      sourceId: uuid(),
    },
    {
      id: 12,
      name: 'Button',
      description: 'This is a preset for Button',
      code: 'button-code',
      props: {},
      metadata: [],
      children: [],
      icon: 'PinOutlinedIcon',
      sourceId: uuid(),
    },
  ]);

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [insertPos, setInsertPos] = useState<'before' | 'after' | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  // --- FLIP animation refs
  const nodeMap = useRef<Record<string, HTMLDivElement | null>>({});
  const prevRects = useRef<Record<string, DOMRect>>({});

  // Measure-before → animate-after
  useLayoutEffect(() => {
    // 1) Last: measure new rects
    const newRects: Record<string, DOMRect> = {};
    for (const it of items) {
      const el = nodeMap.current[it.id];
      if (!el) continue;
      newRects[it.id] = el.getBoundingClientRect();
    }

    // 2) Invert + Play
    for (const it of items) {
      const el = nodeMap.current[it.id];
      if (!el) continue;

      const last = newRects[it.id];
      const first = prevRects.current[it.id];
      if (!first || !last) continue;

      const dy = first.top - last.top;
      const dx = first.left - last.left;

      if (dx || dy) {
        // Invert
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.transition = 'transform 0s';
        // Play
        requestAnimationFrame(() => {
          el.style.transform = '';
          el.style.transition = 'transform 180ms ease';
        });
      }
    }

    // 3) Save for next pass
    prevRects.current = newRects;
  }, [items]);

  const setRef = useCallback(
    (el: HTMLDivElement | null, itemId: number) => {
      nodeMap.current[itemId] = el;
    },
    [nodeMap]
  );

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, item: PresetType) => {
    e.dataTransfer.setData('application/x-builder', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(item.sourceId ?? null);

    // ปรับ drag image ให้โปร่งใสเล็กน้อย (optional)
    const crt = e.currentTarget.cloneNode(true) as HTMLDivElement;
    crt.style.pointerEvents = 'none';
    crt.style.position = 'absolute';
    crt.style.top = '-99999px';
    crt.style.opacity = '0.5';
    crt.style.transform = 'scale(0.99)';
    crt.style.width = '100px';
    crt.style.height = '50px';
    crt.style.textAlign = 'center';
    document.body.appendChild(crt);
    e.dataTransfer.setDragImage(crt, crt.offsetWidth / 2, crt.offsetHeight / 2);
    // cleanup ทันทีหลัง browser snapshot แล้ว
    setTimeout(() => document.body.removeChild(crt), 0);
  };

  const onDragEnd = () => {
    setDraggingId(null);
    setHoverId(null);
    setInsertPos(null);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, target: PresetType) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const pos = e.clientY < midY ? 'before' : 'after';

    setHoverId(target.sourceId ?? null);
    setInsertPos(pos);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>, target: PresetType) => {
    const related = e.relatedTarget as Node | null;
    if (!related || !(e.currentTarget as Node).contains(related)) {
      if (hoverId === target.sourceId) setHoverId(null);
      if (insertPos && hoverId === target.sourceId) setInsertPos(null);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, dropTarget: PresetType) => {
    console.log('onDrop');
    e.preventDefault();
    const draggedItem = JSON.parse(e.dataTransfer.getData('application/x-builder')) as PresetType;

    if (draggedItem.id === dropTarget.id || !insertPos) {
      setHoverId(null);
      setInsertPos(null);
      setDraggingId(null);
      return;
    }

    const updated = [...items];
    const from = updated.findIndex(i => i.id === draggedItem.id);
    let to = updated.findIndex(i => i.id === dropTarget.id);

    if (insertPos === 'after') to = to + 1;

    const [moved] = updated.splice(from, 1);
    const adjustedTo = from < to ? to - 1 : to;
    updated.splice(adjustedTo, 0, moved);

    setItems(updated);
    setHoverId(null);
    setInsertPos(null);
    setDraggingId(null);
  };

    // ------------------------ BIND EVENTS ------------------------ //
  // useEffect(() => {
  //   const dropzone = dropzoneRef.current!;
  //   if (!dropzone) return;

  //   const ac = new AbortController();
  //   const { signal } = ac;

  //   //  const onDragOver = (e: DragEvent) => {
  //   //   e.preventDefault();                     // สำคัญ! ต้องกัน default เสมอ
  //   //   // if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  //   // };

  //   // const onDragEnter = (e: DragEvent) => {
  //   //   e.preventDefault();
  //   //   dropzone.classList.add('g-hover');
  //   // };

  //   // const onDragLeave = () => {
  //   //   dropzone.classList.remove('g-hover');
  //   // };

  //   const onDrop = (e: DragEvent) => {
  //     dropzone.classList.remove('g-hover');
  //     e.preventDefault();
  //     const raw = e.dataTransfer?.getData('application/x-builder');
  //     if (!raw) return;

  //     try {
  //       const payload: PresetType = JSON.parse(raw);
  //       setItems((prev) => [...prev, payload]);
  //     } catch (err) {
  //       console.error('Invalid payload', err);
  //     }
  //   };


  //   dropzone.addEventListener('drop', onDrop, { signal });
  //   dropzone.addEventListener('dragend', onDragEnd, { signal });
  //   dropzone.addEventListener('dragover', (e: DragEvent) => onDragOver(e as unknown as React.DragEvent<HTMLDivElement>, {
  //     sourceId: 'dropzone',
  //     id: 0,
  //     name: '',
  //     code: ''
  //   }), { signal });
  //   dropzone.addEventListener('dragstart', (e: DragEvent) => onDragStart(e as unknown as React.DragEvent<HTMLDivElement>, {
  //     sourceId: 'dropzone',
  //     id: 0,
  //     name: '',
  //     code: ''
  //   }), { signal });
  //   dropzone.addEventListener('dragleave', (e: DragEvent) => onDragLeave(e as unknown as React.DragEvent<HTMLDivElement>, {
  //     sourceId: 'dropzone',
  //     id: 0,
  //     name: '',
  //     code: ''
  //   }), { signal });

  //   return () => {
  //     ac.abort();
  //   };
  // }, []);

  return (
    <div className="canvas" style={{ padding: 16 }}>
      <div id="dropzone" ref={dropzoneRef} className="g-drop-target" data-accept="*">
        {items.map((item) => {
          const showGuide = hoverId === item.sourceId && insertPos;
          const isDragging = draggingId === item.sourceId;

          return (
            <div
              key={item.id}
              ref={(el) => setRef(el, item.id)}
              draggable
              onDragStart={(e) => onDragStart(e, item)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => onDragOver(e, item)}
              onDragLeave={(e) => onDragLeave(e, item)}
              onDrop={(e) => onDrop(e, item)}
              style={{
                position: 'relative',
                padding: '12px 14px',
                border: '1px solid var(--foreground)',
                borderRadius: 12,
                background: 'var(--background)',
                boxShadow: isDragging
                  ? '0 8px 24px rgba(0,0,0,0.15)'
                  : '0 1px 2px rgba(0,0,0,0.06)',
                transform: isDragging ? 'scale(0.98)' : 'none',
                transition:
                  'box-shadow 180ms ease, transform 120ms ease, background 180ms ease',
                opacity: isDragging ? 0.95 : 1,
                cursor: 'grab',
                userSelect: 'none',
              }}
            >
              {/* เส้นไกด์วางแทรก */}
              {showGuide && insertPos === 'before' && (
                <span
                  style={{
                    position: 'absolute',
                    left: -6,
                    right: -6,
                    top: -6,
                    height: 3,
                    background: '#4f46e5',
                    borderRadius: 999,
                    boxShadow: '0 0 0 2px rgba(79,70,229,0.25)',
                    pointerEvents: 'none',
                    // pulse เบา ๆ
                    animation: 'insertPulse 700ms ease-in-out infinite',
                  }}
                />
              )}
              {showGuide && insertPos === 'after' && (
                <span
                  style={{
                    position: 'absolute',
                    left: -6,
                    right: -6,
                    bottom: -6,
                    height: 3,
                    background: '#4f46e5',
                    borderRadius: 999,
                    boxShadow: '0 0 0 2px rgba(79,70,229,0.25)',
                    pointerEvents: 'none',
                    animation: 'insertPulse 700ms ease-in-out infinite',
                  }}
                />
              )}

              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
