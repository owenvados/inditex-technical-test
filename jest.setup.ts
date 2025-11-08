import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';

if (!global.TextEncoder) {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  // @ts-ignore
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}
