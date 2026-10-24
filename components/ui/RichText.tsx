import {PortableText, type PortableTextComponents} from '@portabletext/react';
import {cidAttrs} from '@/lib/utils/cid';
import {cn} from '@/lib/utils/cn';
import type {RichText as RichTextValue} from '@/types/common';

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p>{children}</p>,
    h2: ({children}) => <h2 className="mt-4 font-heading text-h3 font-bold text-text">{children}</h2>,
    h3: ({children}) => <h3 className="mt-2 font-heading text-lg font-semibold text-text">{children}</h3>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc space-y-1 ps-6">{children}</ul>,
    number: ({children}) => <ol className="list-decimal space-y-1 ps-6">{children}</ol>,
  },
  marks: {
    link: ({value, children}) => {
      const href = (value as {href?: string} | undefined)?.href ?? '#';
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="font-medium text-secondary underline underline-offset-4"
          {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({value, className, cid}: {value: RichTextValue; className?: string; cid?: string}) {
  return (
    <div className={cn('flex max-w-body flex-col gap-4 text-base text-text', className)} {...cidAttrs(cid, 'RichText')}>
      <PortableText value={value} components={components} />
    </div>
  );
}
