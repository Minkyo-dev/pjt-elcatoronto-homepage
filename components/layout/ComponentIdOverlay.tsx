'use client';

import {Fragment, useEffect, useState, useSyncExternalStore, type CSSProperties} from 'react';
import {createPortal} from 'react-dom';

/*
 * Design-review overlay: outlines every [data-cid] element and labels it with its ID (lib/utils/cid.ts).
 * Toggle with `?ids=1` / `?ids=0` or Shift+Alt+I; the choice is remembered per browser.
 * Boxes are drawn in a separate fixed layer, so the page layout is never touched.
 */

const STORAGE_KEY = 'elca:component-ids';
const CHANGE_EVENT = 'elca:component-ids-change';
// Section, component, item, deeper. Dev-tool colors, deliberately outside the design tokens.
const LEVEL_COLORS = ['rgb(225 29 72)', 'rgb(37 99 235)', 'rgb(22 163 74)', 'rgb(217 119 6)'];
const LABEL_HEIGHT = 16;
const CHAR_WIDTH = 6.7;

type Rect = {top: number; left: number; right: number; bottom: number};
type Box = {key: string; id: string; name: string; level: number; rect: Rect; clip: Rect; labelTop: number; labelLeft: number};
type Layer = {key: string; host: HTMLElement; boxes: Box[]};

function readEnabled(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeEnabled(on: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
  } catch {
    // Storage blocked: the toggle still works for this page view.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function intersect(a: Rect, b: Rect): Rect {
  return {
    top: Math.max(a.top, b.top),
    left: Math.max(a.left, b.left),
    right: Math.min(a.right, b.right),
    bottom: Math.min(a.bottom, b.bottom),
  };
}

function isEmpty(rect: Rect): boolean {
  return rect.right - rect.left < 1 || rect.bottom - rect.top < 1;
}

/** Visible area of an element: the viewport cut down by every scrolling or clipping ancestor. */
function clipRect(element: Element, viewport: Rect): Rect {
  let clip = viewport;
  for (let node = element.parentElement; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.overflowX !== 'visible' || style.overflowY !== 'visible') clip = intersect(clip, node.getBoundingClientRect());
  }
  return clip;
}

/** HOM-03 → 0, HOM-03-02 → 1, HOM-03-02a → 2. */
function levelOf(id: string): number {
  return Math.max(0, id.split('-').length - 2) + (/[a-z]$/.test(id) ? 1 : 0);
}

function labelWidth(text: string): number {
  return text.length * CHAR_WIDTH + 8;
}

function measure(): Layer[] {
  const viewport = {top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight};
  const layers = new Map<HTMLElement, Box[]>();

  document.querySelectorAll<HTMLElement>('[data-cid]').forEach((element, index) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;
    if (element.checkVisibility && !element.checkVisibility({opacityProperty: true, visibilityProperty: true})) return;
    const rect = {top: bounds.top, left: bounds.left, right: bounds.right, bottom: bounds.bottom};
    const clip = clipRect(element, viewport);
    if (isEmpty(intersect(rect, clip))) return;

    // A modal <dialog> sits in the browser's top layer; its boxes must live inside it to be seen.
    const host = element.closest<HTMLElement>('dialog[open]') ?? document.body;
    const id = element.dataset.cid ?? '';
    const boxes = layers.get(host) ?? [];
    boxes.push({key: `${index}:${id}`, id, name: element.dataset.cidName ?? '', level: levelOf(id), rect, clip, labelTop: 0, labelLeft: 0});
    layers.set(host, boxes);
  });

  return Array.from(layers, ([host, boxes], index) => ({
    key: host === document.body ? 'body' : `dialog-${index}`,
    host,
    boxes: placeLabels(boxes),
  }));
}

/** Labels start at the top-left of the visible box and step aside when they would cover another label. */
function placeLabels(boxes: Box[]): Box[] {
  const placed: Rect[] = [];
  const ordered = [...boxes].sort((a, b) => a.level - b.level);
  for (const box of ordered) {
    const visible = intersect(box.rect, box.clip);
    const width = labelWidth(box.id);
    let left = visible.left;
    let top = visible.top;
    for (let attempt = 0; attempt < 30; attempt++) {
      const candidate = {top, left, right: left + width, bottom: top + LABEL_HEIGHT};
      const hit = placed.find((other) => !isEmpty(intersect(candidate, other)));
      if (!hit) break;
      left = hit.right + 2;
      if (left + width > visible.right) {
        left = visible.left;
        top += LABEL_HEIGHT + 2;
      }
    }
    box.labelTop = top;
    box.labelLeft = left;
    placed.push({top, left, right: left + width, bottom: top + LABEL_HEIGHT});
  }
  return boxes;
}

function signature(layers: Layer[]): string {
  return layers
    .map((layer) =>
      layer.key +
      layer.boxes
        .map((box) => [box.key, box.rect.top, box.rect.left, box.rect.right, box.rect.bottom, box.clip.top, box.clip.bottom, box.labelTop, box.labelLeft].join(','))
        .join(';'),
    )
    .join('|');
}

function insideOverlay(node: Node): boolean {
  const element = node instanceof Element ? node : node.parentElement;
  return Boolean(element?.closest('[data-cid-overlay]'));
}

function useBoxes(enabled: boolean): Layer[] {
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let last = '';
    const update = () => {
      frame = 0;
      const next = measure();
      const key = signature(next);
      if (key === last) return;
      last = key;
      setLayers(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const mutations = new MutationObserver((records) => {
      if (records.some((record) => !insideOverlay(record.target))) schedule();
    });
    mutations.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden', 'open', 'data-cid', 'aria-hidden', 'aria-selected', 'aria-expanded'],
    });
    const resize = new ResizeObserver(schedule);
    resize.observe(document.documentElement);
    document.addEventListener('scroll', schedule, {capture: true, passive: true});
    document.addEventListener('transitionend', schedule, true);
    window.addEventListener('resize', schedule);
    // Catches what the observers miss (CSS animations, images finishing layout, carousel timers).
    const interval = window.setInterval(schedule, 1000);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize.disconnect();
      document.removeEventListener('scroll', schedule, {capture: true});
      document.removeEventListener('transitionend', schedule, true);
      window.removeEventListener('resize', schedule);
      window.clearInterval(interval);
    };
  }, [enabled]);

  return enabled ? layers : [];
}

const layerStyle: CSSProperties = {position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2147483646};

const labelStyle: CSSProperties = {
  position: 'fixed',
  height: LABEL_HEIGHT,
  padding: '0 4px',
  font: '600 11px/16px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  color: 'white',
  whiteSpace: 'nowrap',
  borderRadius: 2,
  pointerEvents: 'auto',
  cursor: 'copy',
  userSelect: 'none',
};

function BoxView({box, copied, onCopy}: {box: Box; copied: boolean; onCopy: (id: string) => void}) {
  const color = LEVEL_COLORS[Math.min(box.level, LEVEL_COLORS.length - 1)];
  const {rect, clip} = box;
  const inset = [clip.top - rect.top, rect.right - clip.right, rect.bottom - clip.bottom, clip.left - rect.left]
    .map((value) => `${Math.max(0, value)}px`)
    .join(' ');
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.right - rect.left,
          height: rect.bottom - rect.top,
          border: `${box.level === 0 ? 2 : 1.5}px ${box.level >= 2 ? 'dashed' : 'solid'} ${color}`,
          clipPath: `inset(${inset})`,
        }}
      />
      <span
        title={`${box.id} · ${box.name} — click to copy`}
        onClick={() => onCopy(box.id)}
        style={{...labelStyle, top: box.labelTop, left: box.labelLeft, background: color}}
      >
        {copied ? 'copied' : box.id}
      </span>
    </>
  );
}

export function ComponentIdOverlay() {
  const enabled = useSyncExternalStore(subscribe, readEnabled, () => false);
  const layers = useBoxes(enabled);
  const [copied, setCopied] = useState<string | null>(null);

  // `?ids=1` / `?ids=0` turns the overlay on or off and remembers the choice.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('ids');
    if (param !== null) writeEnabled(param !== '0');
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || !event.altKey || event.code !== 'KeyI') return;
      event.preventDefault();
      writeEnabled(!readEnabled());
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!enabled) return null;

  const copy = (id: string) => {
    void navigator.clipboard?.writeText(id);
    setCopied(id);
  };
  const count = layers.reduce((total, layer) => total + layer.boxes.length, 0);

  return (
    <>
      {layers.map((layer) =>
        createPortal(
          <div data-cid-overlay="" aria-hidden="true" style={layerStyle}>
            {layer.boxes.map((box) => (
              <Fragment key={box.key}>
                <BoxView box={box} copied={copied === box.id} onCopy={copy} />
              </Fragment>
            ))}
          </div>,
          layer.host,
          layer.key,
        ),
      )}
      <div
        data-cid-overlay=""
        style={{
          ...labelStyle,
          height: 'auto',
          bottom: 12,
          left: 12,
          padding: '6px 10px',
          background: 'rgb(23 35 43 / 0.9)',
          cursor: 'pointer',
          zIndex: 2147483647,
        }}
        title="Hide component IDs (Shift+Alt+I)"
        onClick={() => writeEnabled(false)}
      >
        Component IDs · {count} visible · Shift+Alt+I ✕
      </div>
    </>
  );
}
