import 'server-only';
import {posts} from '@/data/mock/posts';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {Post, PostKind} from '@/types/event';

export async function getPosts(options: {locale: Locale; kind?: PostKind}): Promise<Post[]> {
  'use cache';
  const {locale, kind} = options;
  return resolveLocalized(
    posts
      .filter((post) => !kind || post.kind === kind)
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
    locale,
  );
}
