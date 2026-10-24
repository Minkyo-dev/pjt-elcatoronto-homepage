/**
 * Component IDs for design review (docs/component-ids.md).
 *
 * - `HOM-03`      section 3 of a screen
 * - `HOM-03-02`   component 2 inside that section
 * - `HOM-03-02a`  every repeated item of that component (cards, rows, …)
 *
 * IDs are plain data attributes; ComponentIdOverlay draws them when toggled on (`?ids=1` or Shift+Alt+I).
 */
export type Cid = string | undefined;

const SECTION_CID = /^[A-Z]{3}-\d{2}$/;

export function cidAttrs(cid: Cid, name: string): {'data-cid': string; 'data-cid-name': string} | undefined {
  return cid ? {'data-cid': cid, 'data-cid-name': name} : undefined;
}

/** Component inside a section: subCid('HOM-03', 2) → 'HOM-03-02'. Below the component level, nothing is labelled. */
export function subCid(cid: Cid, index: number): Cid {
  return cid && SECTION_CID.test(cid) ? `${cid}-${String(index).padStart(2, '0')}` : undefined;
}

/** ID shared by every repeated item of a list: itemCid('HOM-03-02') → 'HOM-03-02a'. */
export function itemCid(cid: Cid, letter = 'a'): Cid {
  return cid ? `${cid}${letter}` : undefined;
}
