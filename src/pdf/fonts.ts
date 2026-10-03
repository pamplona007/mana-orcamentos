import { Font } from '@react-pdf/renderer'

const fontBase = '/fonts'

Font.register({
  family: 'Fraunces',
  fonts: [
    { src: `${fontBase}/fraunces-400-normal.woff2`, fontWeight: 400 },
    { src: `${fontBase}/fraunces-400-italic.woff2`, fontWeight: 400, fontStyle: 'italic' },
    { src: `${fontBase}/fraunces-500-normal.woff2`, fontWeight: 500 },
    { src: `${fontBase}/fraunces-700-normal.woff2`, fontWeight: 700 },
    { src: `${fontBase}/fraunces-700-italic.woff2`, fontWeight: 700, fontStyle: 'italic' },
  ],
})

Font.register({
  family: 'Inter',
  fonts: [
    { src: `${fontBase}/inter-400-normal.woff2`, fontWeight: 400 },
    { src: `${fontBase}/inter-500-normal.woff2`, fontWeight: 500 },
    { src: `${fontBase}/inter-600-normal.woff2`, fontWeight: 600 },
    { src: `${fontBase}/inter-700-normal.woff2`, fontWeight: 700 },
  ],
})
