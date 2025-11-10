# Recipe editor — Live preview + PDF export

Small React app (Vite) that provides a split-screen recipe editor with live preview. The preview can be printed (macOS print dialog allows "Save as PDF") or downloaded automatically as PDF using html2pdf.

Quick start

1. From the project folder:

```bash
cd /Users/luckymarty/Documents/Dev/Perso/Projets/recipe/system
npm install
npm run dev
```

2. Open the dev URL printed by Vite (usually http://localhost:5173).

How it works

- Left: editor form (French labels) to add title, ingredients, and steps.
- Right: live preview that updates instantly while typing.
- "Imprimer / Enregistrer en PDF": opens print dialog (you can choose "Save as PDF" on macOS).
- "Télécharger PDF (auto)": generates a PDF programmatically using html2pdf.

Avoiding browser headers/footers (date, page numbers)

- Many browsers add a header/footer (date, page numbers, URL) when you use the print dialog. This is controlled by the browser's print settings and cannot be removed by page CSS in a reliable, cross-browser way.
- To get a PDF without those headers/footers:
	- Easiest: click "Télécharger PDF (auto)" in the app — this generates a clean PDF client-side without browser-added headers.
	- Or: use "Imprimer / Enregistrer en PDF" and, in the print dialog, uncheck the option named like "Headers and footers" or "En-têtes et pieds de page" (in Chrome / Safari click "Show Details" or look in the printer options).

Examples on macOS:

- In Chrome: File → Print → More settings → uncheck "Headers and footers".
- In Safari: File → Print → uncheck "Print headers and footers" in the dialog options.

Notes and next steps

- The project uses `html2pdf.js` to create a PDF client-side. If you prefer a server-side PDF with better control over layout, we can add an endpoint to render PDF on the server.
- We can add localization strings, images, ingredient quantities with structured fields, and nicer print layout.
