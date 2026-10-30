"use client";

import { useEffect } from "react";

export default function ImageProtection() {
  useEffect(() => {
    // 禁用右键菜单
    const handleContextMenu = (e: MouseEvent) => {
      e = e || window.event;
      if (e) {
        e.preventDefault();
        e.returnValue = false;
      }
      return false;
    };

    // 禁止拖拽图片
    const handleDragStart = (e: DragEvent) => {
      e = e || window.event;
      if (e) {
        e.preventDefault();
        e.returnValue = false;
      }
      return false;
    };

    // 禁止选择图片
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e = e || window.event;
        if (e) {
          e.preventDefault();
          e.returnValue = false;
        }
        return false;
      }
    };

    window.addEventListener("contextmenu", handleContextMenu, true);
    window.addEventListener("dragstart", handleDragStart, true);
    window.addEventListener("selectstart", handleSelectStart, true);

    // 给所有现有图片加属性
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.setAttribute("draggable", "false");
      img.style.userSelect = "none";
      img.oncontextmenu = () => false;
      img.ondragstart = () => false;
    });

    // 监听新加载的图片
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement) {
            node.setAttribute("draggable", "false");
            node.style.userSelect = "none";
            node.oncontextmenu = () => false;
            node.ondragstart = () => false;
          }
          // 检查节点内部的图片
          if (node instanceof HTMLElement) {
            const imgs = node.querySelectorAll("img");
            imgs.forEach((img) => {
              img.setAttribute("draggable", "false");
              img.style.userSelect = "none";
              img.oncontextmenu = () => false;
              img.ondragstart = () => false;
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, true);
      window.removeEventListener("dragstart", handleDragStart, true);
      window.removeEventListener("selectstart", handleSelectStart, true);
      observer.disconnect();
    };
  }, []);

  return null;
}
