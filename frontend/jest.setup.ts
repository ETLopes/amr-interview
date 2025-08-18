import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Polyfill AbortSignal.timeout for Node/JSDOM
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anyAbortSignal = AbortSignal as any;
if (typeof anyAbortSignal !== 'undefined' && typeof anyAbortSignal.timeout !== 'function') {
  anyAbortSignal.timeout = (ms: number) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}


