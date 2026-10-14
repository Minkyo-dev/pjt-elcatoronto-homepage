import {describe, expect, it} from 'vitest';
import {AVATAR_TONES, avatarTone, getInitials} from '@/lib/utils/avatar';

describe('getInitials', () => {
  it('uses first and last initials for Latin names', () => {
    expect(getInitials('Jiwon Kim')).toBe('JK');
    expect(getInitials('Seoyeon K.')).toBe('SK');
    expect(getInitials('  taeyoung   moon ')).toBe('TM');
    expect(getInitials('Madonna')).toBe('M');
  });

  it('uses the family name syllable for Korean names', () => {
    expect(getInitials('김지원')).toBe('김');
    expect(getInitials('서연 K.')).toBe('서');
  });

  it('returns a placeholder for blank names', () => {
    expect(getInitials('   ')).toBe('?');
  });
});

describe('avatarTone', () => {
  it('is deterministic and picks from the token palette', () => {
    expect(avatarTone('jiwon-kim')).toBe(avatarTone('jiwon-kim'));
    expect(AVATAR_TONES).toContain(avatarTone('anything'));
  });
});
