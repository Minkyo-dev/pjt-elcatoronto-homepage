import {Inter, Manrope, Noto_Sans_KR} from 'next/font/google';

const inter = Inter({subsets: ['latin'], variable: '--font-inter', display: 'swap'});
const manrope = Manrope({subsets: ['latin'], variable: '--font-manrope', display: 'swap'});
// Korean glyphs are split into many unicode-range files; do not preload them all.
const notoKr = Noto_Sans_KR({subsets: ['latin'], variable: '--font-noto-kr', display: 'swap', preload: false});

export const fontVariables = `${inter.variable} ${manrope.variable} ${notoKr.variable}`;
