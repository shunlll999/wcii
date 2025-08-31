"use client";
import { PresetType } from "@Shared/types";
import React, { useEffect, useRef } from "react";
import "./iframe.css";

export default function IframeCanvasPage() {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const hoverNodeRef = useRef<HTMLElement | null>(null);
  const insertPositionRef = useRef<"before" | "after" | null>(null);

  // ---------- สร้าง node ใหม่ ----------
  const createNode = (data: PresetType) => {
    const el = document.createElement("div");
    el.className = "node";
    switch (data.code) {
      case "text-code":
        el.innerHTML = '<p contenteditable="true">Editable text ✏️</p>';
        break;
      case "button-code":
        el.innerHTML = '<button class="btn">Button</button>';
        break;
      case "image-code":
        el.innerHTML = '<img class="img-content" src="https://www.dpreview.com/files/p/articles/3912995929/Krobus-cat-sony-50-150-f2-gm.jpeg" alt="placeholder"/>';
        break;
      case "container-code":
        el.innerHTML =
          '<div class="node" style="background:#0d0d0d">Container</div>';
        break;
    }
    return el;
  };

  // ---------- จัดการ highlight ----------
  const clearHighlight = () => {
    // clear highlight node
    if (hoverNodeRef.current) {
      hoverNodeRef.current.classList.remove("g-insert-before", "g-insert-after");
      hoverNodeRef.current = null;
    }
    // clear highlight dropzone
    dropzoneRef.current?.classList.remove("g-hover");
    insertPositionRef.current = null;
  };

  const setHighlightNode = (el: HTMLElement, position: "before" | "after") => {
    if (hoverNodeRef.current && hoverNodeRef.current !== el) {
      hoverNodeRef.current.classList.remove("g-insert-before", "g-insert-after");
    }
    hoverNodeRef.current = el;
    insertPositionRef.current = position;
    el.classList.add(
      position === "before" ? "g-insert-before" : "g-insert-after"
    );
  };

  useEffect(() => {
    const dropzone = dropzoneRef.current!;
    if (!dropzone) return;

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      const target = (e.target as HTMLElement)?.closest(".node");

      if (!target || !dropzone.contains(target)) {
        // ถ้าไม่ได้ hover node → highlight dropzone ทั้งกล่อง
        if (!dropzone.classList.contains("g-hover")) {
          dropzone.classList.add("g-hover");
        }
        // clear node highlight ถ้ามี
        if (hoverNodeRef.current) {
          hoverNodeRef.current.classList.remove(
            "g-insert-before",
            "g-insert-after"
          );
          hoverNodeRef.current = null;
          insertPositionRef.current = null;
        }
        return;
      }

      // ถ้า hover node → highlight node + remove dropzone highlight
      dropzone.classList.remove("g-hover");
      const rect = target.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const position = e.clientY < midY ? "before" : "after";
      setHighlightNode(target as HTMLElement, position);
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer?.getData("application/x-builder");
      if (!raw) return;

      const data: PresetType = JSON.parse(raw);
      const newNode = createNode(data);

      // ถ้ามี hover node → insert before/after
      if (hoverNodeRef.current && insertPositionRef.current) {
        if (insertPositionRef.current === "before") {
          hoverNodeRef.current.parentNode?.insertBefore(
            newNode,
            hoverNodeRef.current
          );
        } else {
          hoverNodeRef.current.parentNode?.insertBefore(
            newNode,
            hoverNodeRef.current.nextSibling
          );
        }
      } else {
        // ถ้าไม่มี node ที่ hover → append ปกติ
        dropzone.appendChild(newNode);
      }

      clearHighlight();
    };

    const onDragLeave = (e: DragEvent) => {
      // ถ้าออกจาก dropzone → clear highlight
      if (!dropzone.contains(e.relatedTarget as Node)) {
        clearHighlight();
      }
    };

    dropzone.addEventListener("dragover", onDragOver);
    dropzone.addEventListener("drop", onDrop);
    dropzone.addEventListener("dragleave", onDragLeave);

    return () => {
      dropzone.removeEventListener("dragover", onDragOver);
      dropzone.removeEventListener("drop", onDrop);
      dropzone.removeEventListener("dragleave", onDragLeave);
    };
  }, []);

  return (
    <div className="canvas">
      <div
        id="dropzone"
        ref={dropzoneRef}
        className="g-drop-target"
        data-accept="*"
      >
        <div className="node" style={{ opacity: 0.7 }}>
          Drop components here…
        </div>
      </div>
    </div>
  );
}

