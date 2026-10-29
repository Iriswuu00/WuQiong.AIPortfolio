# Card Globe Demo — Handoff

## Run
```bash
cd card-globe-final
python3 -m http.server 4173
```
Open `http://127.0.0.1:4173/`.

## Deployment
Upload the complete folder, keeping these relative paths unchanged:

```text
card-globe-final/
├── index.html
├── photos/
│   └── photo-01.jpg ... photo-31.jpg
├── video/
│   └── runner.webm
├── HANDOFF.md
└── CHECKSUMS.sha256
```

`index.html` contains all HTML, CSS and JavaScript inline. The canvas renders the 3D photo sphere. The WebM runner is a separate overlay at the top center.

## Important
- Do not rename the `photos/` or `video/` directories unless the paths in `index.html` are updated.
- The WebM has an alpha channel and is intentionally muted for reliable autoplay.
- The WebM file was copied byte-for-byte and must not be transcoded or replaced by the old generated runner frames.
