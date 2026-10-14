import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return path.endsWith('.ts') || path.endsWith('.tsx') ? [path] : [];
  });
}

const componentFiles = sourceFiles('components');
const uiFiles = [...componentFiles, ...sourceFiles('app')];

describe('architecture guards', () => {
  it('components never import the repository or mock data (pure helpers are allowed)', () => {
    const offenders = componentFiles.filter((file) =>
      /from '@\/(data\/|lib\/content\/(?!helpers\/))/.test(readFileSync(file, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });

  it('components and routes use tokens: no hex colors, no arbitrary px values', () => {
    const offenders = uiFiles.flatMap((file) => {
      const hits = [...readFileSync(file, 'utf8').matchAll(/#[0-9a-fA-F]{3,8}\b|\[[^\]\n]*\d+px[^\]\n]*\]/g)].map((m) => m[0]);
      return hits.length > 0 ? [`${file}: ${hits.join(', ')}`] : [];
    });
    expect(offenders).toEqual([]);
  });
});
