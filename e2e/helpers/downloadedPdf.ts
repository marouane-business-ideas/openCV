import { readFile } from 'node:fs/promises';
import { expect, type Download } from '@playwright/test';

// Opens a downloaded file the way a PDF reader would (pdf.js is Firefox's): fails when the file isn't a PDF, like
// the app's HTML page saved as "CV.pdf", or is a broken one. Returns its pages' text, words separated by spaces
export const openDownloadedPdf = async (download: Download) =>
  openPdf(new Uint8Array(await readFile(await download.path())));

export const openPdf = async (bytes: Uint8Array) => {
  // Every PDF starts with this header, within its first 1024 bytes
  const header = new TextDecoder().decode(bytes.slice(0, 1024));
  expect(header, 'the downloaded file should be a PDF').toContain('%PDF-');

  // pdf.js is an ES module, which these tests (CommonJS) can only load this way. Its legacy build runs in Node
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  // A copy: pdf.js takes over the bytes it reads
  const pdf = await getDocument({ data: bytes.slice() }).promise;
  const pages: string[] = [];
  for (let number = 1; number <= pdf.numPages; number++) {
    const { items } = await (await pdf.getPage(number)).getTextContent();
    pages.push(items.map((item) => ('str' in item ? item.str : '')).join(' '));
  }
  await pdf.destroy();

  return { pageCount: pages.length, text: pages.join('\n') };
};

// Whether the PDF shows this text: a PDF stores text in pieces, with or without spaces between them, and as
// displayed (some templates show the name in capitals)
const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();
export const pdfShows = (pdfText: string, text: string) => normalize(pdfText).includes(normalize(text));
