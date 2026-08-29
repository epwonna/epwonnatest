import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT for GitHub Pages:
// If you deploy to https://<username>.github.io/<repo-name>/ (a normal project repo),
// set base to '/<repo-name>/' below, e.g. base: '/ep-wonna/'.
// If you deploy to a user/organization page (https://<username>.github.io/) or a
// custom domain, leave base as '/'.
export default defineConfig({
  plugins: [react()],
  base: '/epwonnatest/',
})