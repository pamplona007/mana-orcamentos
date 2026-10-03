import { Font } from '@react-pdf/renderer'

const fontBase = '/fonts'

// Static (non-variable) TTF files from Fontsource — official react-pdf v4 docs
// say "Any OpenType Variable fonts... does not work properly because PDF 2.0
// spec does not support those. It is required to register separate fonts".
// fontkit 2.0.4 has a bug in TTFGlyph._getCBox() for empty glyphs (space etc.) —
// patched in node_modules/fontkit/dist/{main,browser}.cjs.
Font.register({
  family: 'Fraunces',
  fonts: [
    { src: `${fontBase}/fraunces-latin-400-normal.ttf`, fontWeight: 400 },
    { src: `${fontBase}/fraunces-latin-400-italic.ttf`, fontWeight: 400, fontStyle: 'italic' },
    { src: `${fontBase}/fraunces-latin-700-normal.ttf`, fontWeight: 700 },
  ],
})

Font.register({
  family: 'Inter',
  fonts: [
    { src: `${fontBase}/inter-latin-400-normal.ttf`, fontWeight: 400 },
    { src: `${fontBase}/inter-latin-500-normal.ttf`, fontWeight: 500 },
    { src: `${fontBase}/inter-latin-600-normal.ttf`, fontWeight: 600 },
    { src: `${fontBase}/inter-latin-700-normal.ttf`, fontWeight: 700 },
  ],
})