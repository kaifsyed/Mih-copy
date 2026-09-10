"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { PlusIcon, MinusIcon, CloseIcon } from "@/components/ui/icons";

type ZoomableImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function ZoomableImage({ src, alt, priority = false }: ZoomableImageProps) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxTranslate, setLightboxTranslate] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const lightboxContainerRef = useRef<HTMLDivElement>(null);
  const lightboxImgRef = useRef<HTMLImageElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });

  const ZOOM_STEP = 0.25;
  const MAX_INLINE_ZOOM = 2;
  const MAX_LIGHTBOX_ZOOM = 2.5;

  const resetLightboxZoom = useCallback(() => {
    setLightboxScale(1);
    setLightboxTranslate({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_INLINE_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(prev - ZOOM_STEP, 1);
      if (next <= 1) {
        setTranslate({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const handleLightboxZoomIn = useCallback(() => {
    setLightboxScale((prev) => Math.min(prev + ZOOM_STEP, MAX_LIGHTBOX_ZOOM));
  }, []);

  const handleLightboxZoomOut = useCallback(() => {
    setLightboxScale((prev) => {
      const next = Math.max(prev - ZOOM_STEP, 1);
      if (next <= 1) {
        setLightboxTranslate({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    translateStart.current = translate;
    e.preventDefault();
  }, [scale, translate]);

  const handleLightboxMouseDown = useCallback((e: React.MouseEvent) => {
    if (lightboxScale <= 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    translateStart.current = lightboxTranslate;
    e.preventDefault();
  }, [lightboxScale, lightboxTranslate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (isLightboxOpen) {
        setLightboxTranslate({
          x: translateStart.current.x + dx,
          y: translateStart.current.y + dy,
        });
      } else {
        setTranslate({
          x: translateStart.current.x + dx,
          y: translateStart.current.y + dy,
        });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
        resetLightboxZoom();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, resetLightboxZoom]);

  const openLightbox = () => {
    setIsLightboxOpen(true);
    resetLightboxZoom();
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    resetLightboxZoom();
    document.body.style.overflow = "";
  };

  const handleImageClick = () => {
    openLightbox();
  };

  return (
    <>
      <div className="relative">
        <div
          ref={imageRef}
          className="relative aspect-square overflow-hidden border border-outline/20 bg-charcoal max-w-[90vw] mx-auto sm:max-w-full"
          style={{ cursor: scale > 1 ? "zoom-out" : "zoom-in" }}
          onClick={handleImageClick}
          onMouseDown={handleMouseDown}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={85}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 50vw"
            className="object-cover transition-transform duration-300"
            style={{
              transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
              transformOrigin: "center center",
            }}
          />
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (scale > 1) {
                  openLightbox();
                } else {
                  handleZoomIn();
                }
              }}
              aria-label={scale > 1 ? "Open full-screen zoom" : "Zoom in product image"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-noir/80 backdrop-blur-sm border border-gold/30 text-gold transition-all hover:bg-gold/20 hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            {scale > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                aria-label="Zoom out product image"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-noir/80 backdrop-blur-sm border border-gold/30 text-gold transition-all hover:bg-gold/20 hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-noir-deep/95 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged product image"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close enlarged product image"
            className="absolute right-6 top-6 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-noir/80 backdrop-blur-sm border border-gold/30 text-gold transition-all hover:bg-gold/20 hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <div
            ref={lightboxContainerRef}
            className="relative w-[min(90vw,1200px)] h-[min(80vh,900px)] flex items-center justify-center p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleLightboxMouseDown}
          >
            <Image
              ref={lightboxImgRef}
              src={src}
              alt={alt}
              fill
              priority
              quality={90}
              sizes="90vw"
              className="object-contain transition-transform duration-200"
              style={{
                transform: `scale(${lightboxScale}) translate(${lightboxTranslate.x}px, ${lightboxTranslate.y}px)`,
                transformOrigin: "center center",
                cursor: lightboxScale > 1 ? "grab" : "zoom-in",
              }}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleLightboxZoomOut}
                aria-label="Zoom out product image"
                disabled={lightboxScale <= 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-noir/80 backdrop-blur-sm border border-gold/30 text-gold transition-all hover:bg-gold/20 hover:border-gold disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleLightboxZoomIn}
                aria-label="Zoom in product image"
                disabled={lightboxScale >= MAX_LIGHTBOX_ZOOM}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-noir/80 backdrop-blur-sm border border-gold/30 text-gold transition-all hover:bg-gold/20 hover:border-gold disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={resetLightboxZoom}
                aria-label="Reset zoom to 1x"
                disabled={lightboxScale === 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-noir/80 backdrop-blur-sm border border-outline/30 text-muted transition-all hover:border-gold/60 hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <span className="text-[0.65rem] font-medium">1×</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}