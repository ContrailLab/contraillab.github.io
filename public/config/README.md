# ContrailLab - Project File Structure Guide

## Page Files (Section Components)

| File | Path | Responsible Page |
|------|------|-----------------|
| `Home.tsx` | `src/sections/Home.tsx` | Landing page with 5 narrative sections (DETECT, GEOLOCATE, LABEL, PREDICT, CASE STUDY), Platform Capabilities, Card Grid, and Partner Logo Wall |
| `Datasets.tsx` | `src/sections/Datasets.tsx` | Contrail Database page - 3D Spline globe, glassmorphism data drawer, dataset download cards |
| `Exhibition.tsx` | `src/sections/Exhibition.tsx` | Spatio-Temporal Exhibition page - contrail observation gallery with filterable grid |
| `Models.tsx` | `src/sections/Models.tsx` | Open-Source Model Zoo page - U-Net++/ASPP/Transformer pipelines with dark code blocks |
| `Monitor.tsx` | `src/sections/Monitor.tsx` | Live Monitor page - WebGIS dashboard with real-time metrics and detection table |
| `Publications.tsx` | `src/sections/Publications.tsx` | Research & Publications page - academic papers with citation formatting |

## Layout / Shared Components

| File | Path | Purpose |
|------|------|---------|
| `AppLayout.tsx` | `src/sections/AppLayout.tsx` | Global navigation bar, footer, partner logo wall (sub-pages only) |
| `App.tsx` | `src/App.tsx` | Root router - manages page state switching between 6 views |
| `PartnersConfig.ts` | `src/sections/PartnersConfig.ts` | Type definitions and JSON loader for partner logos |

## Configuration Files (Editable by Users)

| File | Path | Purpose |
|------|------|---------|
| `partners.json` | `public/config/partners.json` | Partner institution list: id, name, logo path, fallback URL, website URL. Modify this to add/remove/replace partners |

## Logo Folder

| Folder | Path | Purpose |
|--------|------|---------|
| `logos/` | `public/logos/` | Partner institution logo images. Add new PNG/SVG files here, then reference them in `partners.json` |

## Image Assets (Generated)

| Folder | Path | Purpose |
|--------|------|---------|
| `images/` | `public/images/` | All page background images, exhibition photos, dashboard backgrounds |

### Image List by Page

| Image File | Used By | Description |
|-----------|---------|-------------|
| `hero_orbit_earth.jpg` | Home.tsx (Hero) | Earth-from-space hero background |
| `my-aircraft.jpg` | Home.tsx (Hero alt) | Commercial aircraft with contrail |
| `detect_contrail_scene.jpg` | Home.tsx (Detect section) | Aerial contrail detection scene |
| `geolocate_night_map.jpg` | Home.tsx (Geolocate section), Monitor.tsx | Night satellite world map |
| `label_land_water_contrail.jpg` | Home.tsx (Label section), Exhibition | Coastal contrail for labeling |
| `predict_atmospheric_scene.jpg` | Home.tsx (Predict section), Models | Atmospheric contrails for prediction |
| `case_coastline_scene.jpg` | Home.tsx (Case Study section) | Coastline detection case study |
| `data_globe_graphic.jpg` | Home.tsx (Card Grid), Datasets | 3D globe data visualization |
| `exhibit_geostationary.jpg` | Home.tsx (Card Grid), Exhibition | Geostationary satellite observation |
| `exhibit_polar.jpg` | Exhibition | Polar region contrail detection |
| `exhibit_temporal.jpg` | Exhibition | Temporal contrail evolution series |
| `monitor_dashboard.jpg` | Home.tsx (Card Grid), Monitor | WebGIS monitoring console |

## How to Modify Partners (合作单位更换指南)

1. **Add/Replace a partner logo:**
   - Put your logo file (PNG/SVG, recommended square 256x256) into `public/logos/`
   - Open `public/config/partners.json`
   - Add or edit an entry with `"logo": "/logos/your-file.png"`
   - Optionally add `"logoFallback": "https://..."` as a remote backup URL
   - Rebuild and redeploy

2. **Change partner order:**
   - Simply reorder the array in `partners.json`
   - First 5 entries appear on the Hero section (homepage)
   - All entries appear on the bottom Partners section

3. **Add a partner without logo:**
   - Set `"logo": ""` and `"logoFallback": ""`
   - The system will auto-generate a letter placeholder (first letter of the name)
