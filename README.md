# DOARKS Picker — phone app package

A standalone installable web app (PWA). All picker logic and word banks are included. No ChatGPT login, API key, backend, npm install, or build step is required. The existing ChatGPT-hosted site hasn't been changed.

## Fast setup in VS Code

1. Extract this ZIP and open the **DOARKS-Picker** folder in VS Code.
2. To preview, run `python -m http.server 8000` in that folder (on Windows, `py -m http.server 8000` also works if Python is installed).
3. Open `http://localhost:8000`. Wait for **Ready offline**.

Opening index.html directly works for the basic picker, but phone installation and offline caching require HTTPS or localhost.

## Publish once with GitHub Pages

1. Put the contents of this folder in your repository root, with `index.html` at the top level. Include `.nojekyll`.
2. Commit and push to your `main` branch.
3. In the repository's **Settings → Pages**, choose **Deploy from a branch**, then **main** and **/(root)**. Save.
4. Open the HTTPS site link GitHub provides. Relative paths support both a main domain and a repository subfolder.

This publishes the bundled character information and prompts with the site. There are no credentials or private journal entries in this package.

## Add to your phone before traveling

- **Android:** Open the published link in Chrome. Tap **Install app** when offered, or use the browser menu's install/add-to-home-screen option.
- **iPhone:** Open the published link in Safari. Use **Share → Add to Home Screen**. Enable opening as a web app if offered.
- Launch the home-screen icon while online and wait for **Ready offline**. Then turn on airplane mode, close/reopen the app, and try a roll before your trip.

The initial download requires a connection. Once cached, the picker and all its banks work offline. Clearing browser/site data can remove the offline copy. Clipboard permissions vary; the copy buttons offer selectable text if automatic copying is unavailable.

## Included features

Sentence types and information categories, POV-based weights, cast picker, 72 character-relation shades, 32 scene endings, scene shapes, journal-date prompts, 456 vocabulary entries, and short-brief/sentence/relation copy buttons.

Rolls, typed briefs, and custom weights are session-only, as in the original picker. Copy anything you want to keep before closing or reloading. This export doesn't transfer current entries from an already-open browser tab.

## Editing and updating

- `index.html`: layout and styles
- `app.js`: picker behavior
- `data.js`: character data
- `sentence-bank.js`, `pov-weights.js`, `relations.js`, `scene-endings.js`, `vocabulary.js`: editable banks
- `manifest.webmanifest`, `pwa.js`, `sw.js`, `icons/`: installation and offline support

After changing app files, increment `v1` in `sw.js` to `v2` (and so on), then publish the complete folder. Open online, close all app/browser tabs for this site, and reopen to let the updated offline version activate. Add any new required assets to `ASSETS` in `sw.js`.

Reference documentation:
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
