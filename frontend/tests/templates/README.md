# Resume templates: lab and tests

What users download is not the preview: it's a PDF printed by Puppeteer on the server. The template lab and
the template tests look at that PDF, produced by the same code as the download button:

1. `buildResumeHtml()` (`src/components/ResumeModels/buildResumeHtml.ts`) renders the template to HTML in the browser,
2. `renderPdf()` (`backend/src/pdf/renderPdf.js`) prints it with Puppeteer, with the production options.

In dev, the endpoint `/__template-lab/pdf` of the Vite server (see `vite.config.ts`) runs step 2, without
authentication or database.

## Template lab

With `npm run dev` running, open http://localhost:5173/template-lab.html

- pick a template, a resume (see `src/dev/templateLab/fixtures.ts`), a language and a theme color: the pages of the
  real PDF are displayed, with a link to the PDF itself,
- the page reloads when a template file changes,
- "Reference picture" shows a picture over the first page (crop it to the edges of the page first): handy to build
  a template from a design,
- it also checks the PDF: resume content missing from it, text too close to the edges of the page, blank pages.

## Tests

```bash
npm run test:templates                  # from the root or from frontend/
npx playwright show-report              # from frontend/: diffs and PDFs of the run
```

`templates.visual.ts` prints every template with several resumes (`sample`, `long`, `empty`, and `reference` for
the modern template) and fails when:

- content of the resume is missing from the PDF, text is too close to the edges or a page is blank,
- the number of pages changed,
- a page doesn't look like its approved screenshot (`templates.visual.ts-snapshots/`).

`templates.reference.visual.ts` compares a template with the picture it was designed from (`references/`): it
measures the text lines and the rules of the picture and of the first page of the PDF, and fails when a line breaks
differently or moves beyond the tolerance. The report has the measures and the picture over the PDF.

When a change is intended, check the diffs in the report, then approve the new screenshots:

```bash
npm run test:templates -- --update-snapshots
```

The screenshots depend on the OS (fonts, rendering): they are named after it (`-darwin`), and another OS needs its own.

## Adding a template

1. Add its name to `TemplateType` (`src/context/ResumeContext.ts`) and to `RESUME_TEMPLATES` (`backend/src/db.js`,
   the table is migrated at startup).
2. Write the component and its CSS file, like `ModernTemplate.tsx` and `ModernTemplate.css`. The CSS is rendered with the
   markup, so it works in the preview iframe, in the thumbnails of the app and in the PDF: scope every rule under
   the template's root class and set what the host page could change (see the top of `ModernTemplate.css`).
3. Use web fonts (see `modernTemplateFonts.ts`) rather than system fonts, which differ between machines and servers.
4. Register it in `src/components/ResumeModels/templates.ts`, add its name to `locales/*/translation.json`.
5. Add cases to `templates.visual.ts`, check the lab, then generate the screenshots.
6. If it comes from a picture: crop the picture to the edges of the page, save it in `references/`, write a fixture
   with the same content (`src/dev/templateLab/fixtures.ts`) and add it to `templates.reference.visual.ts`.
   Adjust the CSS until that test passes before approving the screenshots.
