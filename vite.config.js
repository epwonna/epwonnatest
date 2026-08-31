import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Repo is "epwonna" → site lives at https://<username>.github.io/epwonna/,
// hence the subpath base below. If a custom domain gets connected later
// (via a CNAME file in public/), change this back to base: '/' — and
// don't forget to also flip segmentCount back to 0 in public/404.html,
// the two have to stay in sync.
export default defineConfig({
  plugins: [react()],
  base: '/epwonna/',
})
