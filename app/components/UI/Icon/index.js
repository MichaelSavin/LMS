/* eslint max-len: 0 */
import React, { PropTypes } from 'react';
import { getOr } from 'lodash/fp';

const svg = {
  checkbox: { paths: ['m5 22.5h5v-5h-5v5z m0-10h5v-5h-5v5z m0 20h5v-5h-5v5z m10-10h20v-5h-20v5z m0-10h20v-5h-20v5z m0 20h20v-5h-20v5z'] },
  formula: { paths: ['m19.6 23l-9.6-3v6.3s4.5 3.7 10 3.7 10-1.2 10-3.7v-6.3l-9.6 3c-0.2 0-0.6 0-0.9 0h0.1z m0.7-16c-0.2 0-0.4 0-0.5 0l-19.1 5.9c-0.9 0.3-0.9 1.4 0 1.7l4.3 1.4v4.4c-0.7 0.4-1.2 1.2-1.2 2.1 0 0.5 0.1 0.9 0.3 1.3-0.2 0.3-0.4 0.8-0.4 1.2v6.5c0 1.4 5.1 1.4 5.1 0v-6.5c0-0.4-0.2-0.9-0.4-1.2 0.2-0.4 0.3-0.8 0.3-1.3 0-0.9-0.5-1.7-1.2-2.1v-3.6l12.2 3.8c0.2 0 0.4 0 0.5 0l19.1-5.9c0.9-0.3 0.9-1.5 0-1.7l-19-6z m-0.3 8c-1.3 0-2.5-0.5-2.5-1.2s1.2-1.3 2.5-1.3 2.5 0.5 2.5 1.3-1.1 1.2-2.5 1.2z'] },
  select: { paths: ['m5 15l15 15 15-15h-30z'] },
  remove: { paths: ['m32.5 5h-10v-1.2c0-0.7-0.6-1.3-1.2-1.3s-1.3 0.6-1.3 1.3v1.2h-10c-1.4 0-2.5 1.1-2.5 2.5v2.5c0 1.4 1.1 2.5 2.5 2.5v22.5c0 1.4 1.1 2.5 2.5 2.5h17.5c1.4 0 2.5-1.1 2.5-2.5v-22.5c1.4 0 2.5-1.1 2.5-2.5v-2.5c0-1.4-1.1-2.5-2.5-2.5z m-2.5 28.8c0 0.6-0.6 1.2-1.2 1.2h-15c-0.7 0-1.3-0.6-1.3-1.2v-21.3h2.5v18.8c0 0.6 0.6 1.2 1.3 1.2s1.2-0.6 1.2-1.2l0-18.8h2.5v18.8c0 0.6 0.6 1.2 1.3 1.2s1.2-0.6 1.2-1.2l0-18.8h2.5l0 18.8c0 0.6 0.6 1.2 1.3 1.2s1.2-0.6 1.2-1.2v-18.8h2.5v21.3z m2.5-24.4c0 0.3-0.3 0.6-0.6 0.6h-21.3c-0.3 0-0.6-0.3-0.6-0.6v-1.3c0-0.3 0.3-0.6 0.6-0.6h21.3c0.3 0 0.6 0.3 0.6 0.6v1.3z'] },
  radio: { paths: ['m5 7.5v5h30v-5h-30z m0 15h30v-5h-30v5z m0 10h30v-5h-30v5z'] },
  video: { paths: ['m22.5 7.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5z m12.5 7.5l-5 5v-2.5c0-1.2-0.8-2.2-2-2.4 1.3-1.4 2-3.2 2-5.1 0-4.1-3.4-7.5-7.5-7.5-3.9 0-7.2 3.1-7.5 6.9-1.3-1.2-3.1-1.9-5-1.9-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5h-2.5v5h2.5v5c0 1.4 1.1 2.5 2.5 2.5h15c1.4 0 2.5-1.1 2.5-2.5v-2.5l5 5h2.5v-20h-2.5z m-25-2.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5v2.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5h-2.5c0-1.4-1.1-2.5-2.5-2.5z m12.5 15h-5v-5h5v5z m5-4.3l-2.9-2.8c-0.2-0.3-0.5-0.4-0.8-0.4h-7.5c-0.7 0-1.3 0.6-1.3 1.3v7.5c0 0.3 0.1 0.6 0.3 0.8 0 0 1.6 1.5 2.9 2.9h-4.4c-0.7 0-1.3-0.6-1.3-1.2v-12.5c0-0.7 0.6-1.3 1.3-1.3h12.5c0.6 0 1.2 0.6 1.2 1.3v4.4z m-5-8.2c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z m12.5 12.5l-2.5-2.5 0-5 2.5-2.5v10z'] },
  image: { paths: ['m27.5 2.5h-22.5v35h30v-27.5l-7.5-7.5z m5 32.5h-25v-30h17.5l7.5 7.5v22.5z m-22.5-25v20h5c0-2.8 2.2-5 5-5-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5c2.8 0 5 2.2 5 5h5v-15l-5-5h-15z'] },
  photo: { paths: ['m20 15c-2.8 0-5 2.2-5 5s2.2 5 5 5c0.2 0 0.4 0 0.7 0-1.9-0.3-3.2-1.9-3.2-3.8 0-2 1.7-3.7 3.7-3.7 1.9 0 3.5 1.4 3.8 3.2 0-0.3 0-0.5 0-0.7 0-2.8-2.2-5-5-5z m15-5h-5l-5-5h-10l-5 5h-5c-1.4 0-2.5 1.1-2.5 2.5v17.5c0 1.4 1.1 2.5 2.5 2.5h30c1.4 0 2.5-1.1 2.5-2.5v-17.5c0-1.4-1.1-2.5-2.5-2.5z m-18.7-2.5h7.5l2.5 2.5h-12.5l2.5-2.5z m-10 22.5c-0.7 0-1.3-0.6-1.3-1.3v-11.2h2.5v-2.5h-2.5v-1.2c0-0.7 0.6-1.3 1.3-1.3h7.1c-0.2 0.1-0.3 0.3-0.5 0.4-3.9 3.9-3.9 10.3 0 14.2l3 2.9h-9.6z m13.7-2.5c-4.1 0-7.5-3.4-7.5-7.5s3.4-7.5 7.5-7.5 7.5 3.4 7.5 7.5-3.4 7.5-7.5 7.5z m12.5-8.7l-5.9-6.3h5.9v6.3z'] },
  input: { paths: ['m35 5h-30c-1.4 0-2.5 1.1-2.5 2.5v25c0 1.3 1.1 2.5 2.5 2.5h30c1.3 0 2.5-1.2 2.5-2.5v-25c0-1.4-1.2-2.5-2.5-2.5z m-27.5 17.5l5-5-5-5 2.5-2.5 7.5 7.5-7.5 7.5-2.5-2.5z m20 2.5h-10v-2.5h10v2.5z'] },
  clone: { paths: ['m27.5 7.5c-2.8 0-5 2.2-5 5 0 1.8 1 3.4 2.5 4.3v0.7c0 2.5-2.5 5-5 5-2.1 0-3.7 0.4-5 1.1v-11.8c1.5-0.9 2.5-2.5 2.5-4.3 0-2.8-2.2-5-5-5s-5 2.2-5 5c0 1.8 1 3.4 2.5 4.3v16.4c-1.5 0.8-2.5 2.4-2.5 4.3 0 2.7 2.2 5 5 5s5-2.3 5-5c0-1.4-0.5-2.5-1.3-3.4 0.7-0.9 1.9-1.6 3.8-1.6 5 0 10-5 10-10v-0.7c1.5-0.9 2.5-2.5 2.5-4.3 0-2.8-2.2-5-5-5z m-15-2.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5z m0 30c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z m15-20c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z'] },
  edit: { paths: ['m30 2.5l-5 5 7.5 7.5 5-5-7.5-7.5z m-27.5 27.5l0 7.5 7.5 0 20-20-7.5-7.5-20 20z m7.5 5h-5v-5h2.5v2.5h2.5v2.5z'] },
  link: { paths: ['m30 10h-5.4c1.9 1.3 3.6 3.5 4.2 5h1.2c2.5 0 5 2.5 5 5s-2.6 5-5 5h-7.5c-2.5 0-5-2.5-5-5 0-0.9 0.2-1.8 0.7-2.5h-5.4c-0.2 0.8-0.3 1.6-0.3 2.5 0 5 5 10 10 10h7.5s10-5 10-10-5-10-10-10z m-18.8 15h-1.2c-2.5 0-5-2.5-5-5s2.6-5 5-5h7.5c2.5 0 5 2.5 5 5 0 0.9-0.2 1.8-0.7 2.5h5.4c0.2-0.8 0.3-1.6 0.3-2.5 0-5-5-10-10-10h-7.5s-10 5-10 10 5 10 10 10h5.4c-1.9-1.2-3.6-3.5-4.2-5z'] },
  hint: { paths: ['m20 15c1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.5-2.5-2.5 1.1-2.5 2.5 1.1 2.5 2.5 2.5z m0-12.5c-9.6 0-17.5 7.9-17.5 17.5s7.9 17.5 17.5 17.5 17.5-7.9 17.5-17.5-7.9-17.5-17.5-17.5z m0 30c-6.9 0-12.5-5.6-12.5-12.5s5.6-12.5 12.5-12.5 12.5 5.6 12.5 12.5-5.6 12.5-12.5 12.5z m2.5-12.5c0-1.2-1.2-2.5-2.5-2.5h-2.5s-2.5 1.3-2.5 2.5h2.5v7.5s1.3 2.5 2.5 2.5h2.5s2.5-1.2 2.5-2.5h-2.5v-7.5z'] },
  add: { paths: ['m22.5 17.5v-10h-5v10h-10v5h10v10h5v-10h10v-5h-10z'] },
  bold: {
    paths: ['M8.197,2c1.376,0,2.45,0.275,3.221,0.824c0.771,0.55,1.157,1.371,1.157,2.464c0,0.555-0.144,1.051-0.43,1.487c-0.286,0.437-0.703,0.766-1.249,0.985c0.702,0.154,1.228,0.483,1.579,0.989C12.824,9.256,13,9.841,13,10.505 c0,1.149-0.37,2.019-1.108,2.608C11.153,13.705,10.105,14,8.751,14H3v-2h1.245V4H3V2h1.245H8.197z M6.59,7.027h1.687 c0.626,0,1.108-0.132,1.445-0.396c0.337-0.264,0.506-0.648,0.506-1.154c0-0.555-0.17-0.964-0.51-1.228S8.872,3.854,8.197,3.854 H6.59V7.027z M6.59,8.692v3.461h2.161c0.622,0,1.095-0.139,1.422-0.416c0.326-0.277,0.49-0.688,0.49-1.232 c0-0.587-0.14-1.037-0.417-1.347C9.967,8.848,9.527,8.692,8.928,8.692H6.59z'],
    viewBox: '0 0 16 16',
    width: '16px',
    height: '16px',
  },
  italic: {
    paths: ['M7,3V2h4v1H9.753l-3,10H8v1H4v-1h1.247l3-10H7z'],
    viewBox: '0 0 16 16',
    width: '16px',
    height: '16px',
  },
  underline: {
    paths: ['M6.045,2v0.992L4.785,3v5.172c0,0.859,0.243,1.512,0.727,1.957s1.124,0.668,1.918,0.668c0.836,0,1.509-0.221,2.019-0.664 c0.511-0.442,0.766-1.096,0.766-1.961V3l-1.26-0.008V2h2.784H13v0.992L11.739,3v5.172c0,1.234-0.398,2.181-1.195,2.84 C9.747,11.671,8.709,12,7.43,12c-1.242,0-2.248-0.329-3.017-0.988c-0.769-0.659-1.152-1.605-1.152-2.84V3L2,2.992V2h1.261H6.045z'],
    viewBox: '0 0 16 16',
    width: '16px',
    height: '16px',
    children: [<rect x={2} y={13} width={11} height={1} key="rect1" />],
  },
  strikethrough: {
    paths: [
      'M-386.7,616.4h6.6c-0.2-0.1-0.5-0.3-0.8-0.5c-0.6-0.3-1.1-0.5-1.5-0.6c-1.3-0.4-2.1-0.8-2.5-1.2s-0.6-0.8-0.6-1.2 c0-0.5,0.2-1,0.6-1.3c0.4-0.4,0.9-0.5,1.6-0.5c0.7,0,1.4,0.3,1.9,0.8c0.3,0.3,0.6,0.9,0.9,1.8l0.1,0l0.8,0.1l0.1,0 c0-0.2,0-0.3,0-0.4c0-0.4,0-0.9-0.1-1.6c-0.1-0.5-0.1-0.8-0.2-1.1c-0.7-0.2-1.2-0.4-1.6-0.4c-0.7-0.1-1.2-0.2-1.5-0.2 c-1.5,0-2.7,0.4-3.5,1.1c-0.8,0.8-1.2,1.7-1.2,2.8c0,0.5,0.1,1.1,0.4,1.7C-387,616-386.9,616.2-386.7,616.4z',
      'M-382.2,618.7c0.6,0.2,1,0.5,1.2,0.6c0.5,0.4,0.7,0.9,0.7,1.4c0,0.4-0.1,0.8-0.4,1.2c-0.3,0.4-0.6,0.6-1.1,0.8 c-0.4,0.2-0.9,0.2-1.2,0.2c-0.4,0-0.8-0.1-1.2-0.2c-0.4-0.1-0.7-0.3-0.9-0.5c-0.3-0.2-0.5-0.5-0.7-0.8c0,0-0.1-0.1-0.1-0.2 c0-0.1-0.1-0.3-0.2-0.5c-0.1-0.2-0.2-0.4-0.3-0.6l-0.9,0v0.4l0,0.3c0,0.2,0,0.4,0,0.6c0,0.3,0,0.8,0,1.4v0.1c0,0.1,0,0.1,0.1,0.2 c0.1,0.1,0.3,0.2,0.6,0.2l1.2,0.4c0.5,0.1,1.1,0.2,1.7,0.2c0.7,0,1.3-0.1,1.8-0.2c0.4-0.1,0.9-0.3,1.4-0.6c0.4-0.3,0.8-0.5,1-0.7 c0.3-0.3,0.5-0.6,0.6-0.9c0.2-0.6,0.4-1.2,0.4-1.9c0-0.3,0-0.6-0.1-0.8L-382.2,618.7L-382.2,618.7z',
      'M-375.1,617.1c-0.1-0.1-0.1-0.1-0.2-0.1h-15.4c-0.1,0-0.2,0-0.2,0.1c-0.1,0.1-0.1,0.1-0.1,0.2v0.6c0,0.1,0,0.2,0.1,0.2 c0.1,0.1,0.1,0.1,0.2,0.1h15.4c0.1,0,0.2,0,0.2-0.1c0.1-0.1,0.1-0.1,0.1-0.2v-0.6C-375,617.2-375,617.1-375.1,617.1z',
    ],
    viewBox: '-391 609 16 16',
    width: '16px',
    height: '16px',
  },
  monospace: {
    paths: [
      'M2.1 3.1c0.2 1.3 0.4 1.6 0.4 2.9 0 0.8-1.5 1.5-1.5 1.5v1c0 0 1.5 0.7 1.5 1.5 0 1.3-0.2 1.6-0.4 2.9-0.3 2.1 0.8 3.1 1.8 3.1s2.1 0 2.1 0v-2c0 0-1.8 0.2-1.8-1 0-0.9 0.2-0.9 0.4-2.9 0.1-0.9-0.5-1.6-1.1-2.1 0.6-0.5 1.2-1.1 1.1-2-0.3-2-0.4-2-0.4-2.9 0-1.2 1.8-1.1 1.8-1.1v-2c0 0-1 0-2.1 0s-2.1 1-1.8 3.1z',
      'M13.9 3.1c-0.2 1.3-0.4 1.6-0.4 2.9 0 0.8 1.5 1.5 1.5 1.5v1c0 0-1.5 0.7-1.5 1.5 0 1.3 0.2 1.6 0.4 2.9 0.3 2.1-0.8 3.1-1.8 3.1s-2.1 0-2.1 0v-2c0 0 1.8 0.2 1.8-1 0-0.9-0.2-0.9-0.4-2.9-0.1-0.9 0.5-1.6 1.1-2.1-0.6-0.5-1.2-1.1-1.1-2 0.2-2 0.4-2 0.4-2.9 0-1.2-1.8-1.1-1.8-1.1v-2c0 0 1 0 2.1 0s2.1 1 1.8 3.1z',
    ],
    viewBox: '0 0 16 16',
    width: '16px',
    height: '16px',
  },
  subscript: {
    paths: [
      `M-289.8,710.1h-2.6l-3-3.5l-2.9,3.5h-2.6l4.3-4.8l-4.1-4.5h2.6l2.8,3.3l2.8-3.3h2.5l-4.1,4.5L-289.8,710.1z M-288.2,712
      l1.7-1.3c0.6-0.4,1-0.8,1.2-1.2c0.2-0.4,0.3-0.7,0.3-1.1c0-0.7-0.2-1.2-0.7-1.6c-0.4-0.4-1-0.6-1.8-0.6c-0.7,0-1.3,0.2-1.7,0.6
      c-0.4,0.4-0.6,1-0.6,1.9h1.4c0-0.5,0.1-0.8,0.3-1c0.2-0.2,0.4-0.3,0.7-0.3c0.3,0,0.6,0.1,0.7,0.3c0.2,0.2,0.3,0.4,0.3,0.7
      c0,0.3-0.1,0.5-0.3,0.8c-0.2,0.2-0.6,0.6-1.4,1.2c-0.7,0.5-1.5,0.9-1.8,1.3l0,1.6h4.8V712L-288.2,712L-288.2,712L-288.2,712z`,
    ],
    viewBox: '-301 699 16 16',
    width: '16px',
    height: '16px',
  },
  superscript: {
    paths: [
      `M-148.2,363.2l4.3,4.8h-2.6l-3-3.5l-2.9,3.5h-2.6l4.3-4.8l-4.1-4.5h2.6l2.8,3.3l2.8-3.3h2.5L-148.2,363.2z M-142.3,359.9
      l1.8-1.3c0.6-0.4,1-0.8,1.2-1.2c0.2-0.4,0.3-0.7,0.3-1.1c0-0.7-0.2-1.2-0.7-1.6c-0.4-0.4-1-0.6-1.8-0.6c-0.7,0-1.3,0.2-1.7,0.6
      c-0.4,0.4-0.6,1-0.6,1.9h1.4c0-0.5,0.1-0.8,0.3-1c0.2-0.2,0.4-0.3,0.7-0.3c0.3,0,0.6,0.1,0.7,0.3c0.2,0.2,0.3,0.4,0.3,0.7
      c0,0.3-0.1,0.5-0.2,0.8c-0.2,0.2-0.6,0.6-1.4,1.2c-0.7,0.5-1.5,0.9-1.8,1.3l0,1.6h4.8v-1.2H-142.3L-142.3,359.9z`,
    ],
    viewBox: '-155.1 353.1 16 16',
    width: '16px',
    height: '16px',
  },
  function: {
    paths: [
      'M15.6,5.29C14.5,5.19 13.53,6 13.43,7.11L13.18,10H16V12H13L12.56,17.07C12.37,19.27 10.43,20.9 8.23,20.7C6.92,20.59 5.82,19.86 5.17,18.83L6.67,17.33C6.91,18.07 7.57,18.64 8.4,18.71C9.5,18.81 10.47,18 10.57,16.89L11,12H8V10H11.17L11.44,6.93C11.63,4.73 13.57,3.1 15.77,3.3C17.08,3.41 18.18,4.14 18.83,5.17L17.33,6.67C17.09,5.93 16.43,5.36 15.6,5.29Z',
    ],
    viewBox: '0 0 24 24',
    width: '16px',
    height: '24px',
  },
};

const Icon = ({
  action,
  color,
  size,
  type,
}) => (
  <span onClick={action}>
    <svg
      style={{ color }}
      width={getOr(size + 7.5, [type, 'width'], svg)}
      height={getOr(size, [type, 'height'], svg)}
      viewBox={getOr('0 0 45 45', [type, 'viewBox'], svg)}
    >
      {getOr([], [type, 'paths'], svg).map((d, key) => <path key={key} d={d} />)}
      {svg[type].children}
    </svg>
  </span>
);

Icon.propTypes = {
  action: PropTypes.func,
  color: PropTypes.string,
  size: PropTypes.number,
  type: PropTypes.string.isRequired,
};

export default Icon;
