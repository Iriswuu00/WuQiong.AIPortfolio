# Card Globe — Technical Handoff

## Current behavior
- Five latitude rows of portrait cards form a spherical photo globe.
- Card counts per row: `8 / 12 / 14 / 12 / 8`.
- Latitude values: `64.25 / 33.85 / 0 / -33.85 / -64.25` degrees.
- 54 card slots are filled from 31 photos.
- The assignment logic ensures all 31 photos are used at least once and avoids reusing the same photo in directly neighboring slots.
- Sphere rotation axis: horizontal X.
- Rotation: 20 seconds per revolution; top moves backward and bottom moves forward.
- Cards use an 8 x 6 curved mesh, projected with perspective each animation frame.
- Back-facing card fade: 55%.
- Background: pure black.

## Runner video
- Source: `video/runner.webm`
- Format: WebM, VP9 with alpha, 720 x 720, 30 fps, approximately 4.05 seconds.
- Playback: native HTML `<video autoplay muted loop playsinline>`.
- The video file is not transcoded, trimmed, resized, retimed, filtered, or otherwise modified.
- Display size and top-center placement are controlled only through CSS.
- Current runner display height is double the previous size.

## Key settings in index.html
- `RING_COUNTS` — card counts for each latitude row.
- `LATITUDES` — five latitude values.
- `CONFIG` — globe size, gap, back fade, duration, camera distance, mesh resolution and corner radius.
- `IMAGE_SOURCES` — 31 photo paths.
- `.runner-video` — top-center video positioning and display size.

## Browser requirements
- Modern browser with WebGL-independent Canvas 2D support.
- VP9 alpha support is required for the transparent WebM runner. Modern Chrome, Edge and Safari are recommended.
- Muted autoplay is required by most browser autoplay policies.

## Verification
- HTML JavaScript passes `node --check`.
- All 31 referenced JPEGs exist and load successfully.
- The WebM copy has the same MD5 as the supplied source: `af6bb19f64645811138d5c1a5ac03f6a`.
- The sphere silhouette has been checked as circular in the current desktop viewport.
