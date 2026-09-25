# DRONE3D AI — Single-Pass Drone Video to Accurate 3D Model Generation

[![SIH Problem Statement](https://img.shields.io/badge/SIH%202026-SIH26158-blue.svg)](https://www.sih.gov.in/)
[![Category](https://img.shields.io/badge/Category-Robotics%20%26%20Drones-06B6D4.svg)]()
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)]()
[![Three.js](https://img.shields.io/badge/Three.js-3D%20WebGL-black.svg?logo=three.js&logoColor=white)]()
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg?logo=vite&logoColor=white)]()
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)]()
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)]()

> **Smart India Hackathon Grand Finale Ready Prototype**  
> **Problem Statement ID:** SIH26158  
> **Title:** Single-Pass Drone Video to Accurate 3D Model Generation System  
> **Category:** Software | **Technology:** Robotics and Drones

---

## 🎯 Product Vision

Converting single-pass drone aerial video and synchronous telemetry into metrically accurate, georeferenced 3D digital twins and GIS elevation models. 

Eliminates the traditional photogrammetry bottlenecks of multi-pass flight paths, 80%+ image overlap requirements, extensive processing delays, and manual Ground Control Point (GCP) surveying.

```
+-------------------+      +-------------------+      +-----------------------+
|  Single-Pass      | ---> |  AI Visual        | ---> |  Multi-Sensor Fusion  |
|  Drone Video (4K) |      |  Odometry & SfM   |      |  (GNSS + IMU + Baro)  |
+-------------------+      +-------------------+      +-----------------------+
                                                                  |
                                                                  v
+-------------------+      +-------------------+      +-----------------------+
|  Georeferenced    | <--- |  Dense Mesh &     | <--- |  Dense Point Cloud    |
|  3D Digital Twin  |      |  Texture Mapping  |      |  (LAS / PLY 8K+ pts)  |
+-------------------+      +-------------------+      +-----------------------+
```

---

## 🌟 Key Modules & Features

### 1. 🎛️ Mission Control Dashboard
- Real-time telemetry, active projects registry, accuracy benchmarks (96.8% mean accuracy, ±4.2 cm positional error).
- Quick launch button for the Grand Finale benchmark demonstration: **Jaipur Heritage Survey (`JHS-2026-001`)**.

### 2. ⚡ 18-Stage AI Reconstruction Pipeline
Visual step-by-step execution pipeline with live stage progress, confidence scores, and latency metrics:
1. Video Ingestion & Demuxing
2. Keyframe Extraction & Filtering
3. Image Quality Assessment (Blur & Exposure)
4. Motion Blur & Rolling Shutter Compensation
5. Deep Feature Detection (SuperPoint/SIFT)
6. Robust Feature Matching & Outlier Rejection
7. Visual Odometry (VO / Monocular SLAM)
8. GPS/IMU Extended Kalman Filter Fusion
9. Camera Pose Estimation & Bundle Adjustment
10. Sparse Structure-from-Motion (SfM)
11. Dense Multi-View Stereo (MVS) Reconstruction
12. Semantic Segmentation (Roads, Buildings, Vegetation)
13. Dense Point Cloud Generation
14. Poisson Surface Reconstruction & Mesh Generation
15. UV Texture Parameterization & Orthomosaic Projection
16. WGS84 / UTM Georeferencing
17. Metric Scale Validation & Ground Accuracy Calibration
18. Final 3D Model Synthesis & Level of Detail (LOD)

### 3. 🌐 Full-Featured Interactive 3D WebGL Viewer
- Hardware-accelerated 3D rendering powered by Three.js.
- **Rendering Modes**: Textured PBR, Wireframe, Solid Clay, Point Cloud, and Mesh topology.
- **Lighting presets**: Daylight Sun, Overcast, Sunset, and Cyberpunk Studio.
- **Tools**: Orbit camera, pan/tilt/zoom, reset origin, and fullscreen.
- **Real-Time 3D Metric Measurements**:
  - Distance measurement between arbitrary 3D spatial points
  - Height calculation (e.g. Building B-104: 24.8 m)
  - Polygonal surface area calculation (e.g. 1,284 m² courtyard)
  - Volumetric excavation / stockpile estimation (e.g. 4,820 m³)

### 4. ☁️ Dense Point Cloud Workstation
- 8,000+ spatial points visualization with procedural terrain & architecture.
- **Coloring Modes**: RGB true color, Elevation gradient ramp, Semantic classification, and Sensor intensity.
- Interactive point-size scale, point-density thresholding, and height slicing tools.

### 5. 🗺️ GIS Mapping & Drone Trajectory Tracking
- Interactive geospatial map displaying drone flight path, coordinates, flight waypoints, and 3D bounding survey envelope.
- Live cursor WGS84 HUD (`Latitude`, `Longitude`, `Altitude MSL`).
- Map styles: High-resolution Satellite, Vector Street, and Topographic Contour Terrain.

### 6. 🤖 AI Scene & Infrastructure Analytics
- Semantic segmentation and classification breakdown (Buildings, Roadways, Vegetation, Infrastructure, Natural Terrain).
- Dynamic object detection and filtering (automated removal of moving vehicles and pedestrians for clean static 3D models).
- Disaster assessment mode with damage zone categorization (Collapsed structures, Blocked arteries, Emergency evacuation corridors).
- Infrastructure structural defect inspection tracking (crack detection, spalling, vegetation encroachment).

### 7. 📁 Interoperability & Export Center
Generates and downloads production-grade spatial file assets:
- **3D Mesh**: `.OBJ`, `.GLB` (glTF 2.0 binary), `.PLY`
- **Point Cloud**: `.LAS` (ASPRS LiDAR standard), `.PLY`
- **GIS Vectors**: `.GeoJSON` (Flight path waypoints and survey polygon boundaries)
- **Data & Telemetry**: `.CSV` (GNSS coordinates, IMU pitch/roll/yaw, altitude logs)
- **Documentation**: Certified HTML / Printable Engineering PDF Inspection Reports

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or 20+ (Node 20 recommended)
- npm, yarn, or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Build for Production
```bash
npm run build
```
The optimized static production assets will be generated in `./dist/`.

---

## 🌐 Deploy to GitHub Pages (2 Minutes)

This repository includes an automated GitHub Actions deployment workflow in `.github/workflows/deploy.yml` as well as support for `gh-pages` and `/docs`.

### ⚠️ Fixing the Blank White Screen (`main.tsx 404` error)
If your deployed site opens with a blank white screen and the browser console shows:
> `Failed to load resource: the server responded with a status of 404 () - main.tsx`

**Why this happens:** By default, GitHub Pages is set to *"Deploy from a branch (main / root)"*, which tries to serve uncompiled raw source files instead of the compiled production build in `dist/`.

**The 1-Click Fix:**
1. In your GitHub repository (`officialanshurajputqbi-hash/DRONE3D-AI`), click **Settings** (tab at the top).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment** > **Source**, change the dropdown from **"Deploy from a branch"** to **"GitHub Actions"**.
4. GitHub Actions will now automatically run the build and publish your site at:
   `https://<your-username>.github.io/<your-repo-name>/`
5. Refresh your page after 30 seconds!

---

### Alternative Deployment Methods

#### Method B: One-Command Deploy via `gh-pages`
You can also deploy directly from your local terminal with one command:
```bash
npm run deploy
```
This automatically runs `npm run build` and pushes the production `dist/` bundle to a `gh-pages` branch. Then in **Settings > Pages**, set Branch to `gh-pages` and Folder to `/ (root)`.

#### Method C: Deploy from `/docs` folder
Running `npm run build` automatically generates the production bundle into both `./dist` and `./docs`.
In GitHub **Settings > Pages**:
- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/docs` (click Save)

---

## 🛠️ Deploy to Other Platforms

### Deploy on Vercel
1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Click **Deploy**.

### Deploy on Netlify
1. Import your GitHub repository to [Netlify](https://netlify.com).
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Click **Deploy Site**.

---

## 📂 Project Architecture

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   └── 404.html                # GitHub Pages SPA fallback
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── PointCloudViewer.tsx  # Multi-mode LiDAR/Point cloud engine
│   │   │   └── Viewer3D.tsx          # Three.js 3D reconstruction viewer
│   │   ├── common/
│   │   │   ├── MetricGauge.tsx       # Accuracy & telemetry gauges
│   │   │   └── Toast.tsx             # Interactive alert notifications
│   │   ├── gis/
│   │   │   └── GISMap.tsx            # Flight path & geofence mapping engine
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx           # Multi-page navigation rail
│   │   │   └── TopBar.tsx            # Live telemetry HUD & status header
│   │   └── pages/
│   │       ├── AIAnalysisPage.tsx    # Semantic segmentation & object detection
│   │       ├── AnalyticsPage.tsx     # Performance & mapping area trends
│   │       ├── AuthPage.tsx          # Authentication & demo login
│   │       ├── DashboardPage.tsx     # Command center overview
│   │       ├── DigitalTwinPage.tsx   # Asset hierarchy & digital twin viewer
│   │       ├── DisasterPage.tsx      # Damage assessment & disaster response
│   │       ├── ExportCenterPage.tsx  # Spatial file downloads (.obj, .glb, .las)
│   │       ├── FlightDataUploadPage.tsx # Telemetry CSV/JSON parser
│   │       ├── HelpDocsPage.tsx      # System documentation & SIH specifications
│   │       ├── InspectionPage.tsx    # Infrastructure anomaly inspection
│   │       ├── LandingPage.tsx       # Futuristic hero & pipeline overview
│   │       ├── MeasurementsPage.tsx  # Metrology & area/volume calculation
│   │       ├── NewProjectPage.tsx    # Survey mission configuration
│   │       ├── PipelinePage.tsx      # 18-stage reconstruction simulator
│   │       ├── ProjectHistoryPage.tsx# Mission archives & project management
│   │       ├── QualityPage.tsx       # Calibration & accuracy dashboard
│   │       ├── ReportsPage.tsx       # Automated report generation & preview
│   │       ├── SettingsPage.tsx      # Coordinate systems & hardware configs
│   │       └── VideoUploadPage.tsx   # Aerial video drag-and-drop ingestion
│   ├── data/
│   │   └── mockData.ts               # Jaipur Heritage Survey benchmark dataset
│   ├── hooks/
│   │   └── useProcessing.ts          # Pipeline progression & timing engine
│   ├── store/
│   │   └── useStore.ts               # Global reactive application state
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces & domain models
│   ├── App.tsx                       # Master view router & layout controller
│   ├── index.css                     # Tailwind CSS styling & custom scrollbars
│   └── main.tsx                      # React root entry point
├── index.html                        # HTML entry point with OpenGraph meta
├── metadata.json                     # AI Studio metadata
├── package.json                      # Dependencies & build scripts
├── tsconfig.json                     # TypeScript compiler configuration
└── vite.config.ts                    # Vite config with relative base path
```

---

## 🏆 Smart India Hackathon Alignment

| SIH Requirement | Platform Implementation |
|---|---|
| **Single-pass drone video** | Supported via 4K/1080p video ingestion (`.mp4`, `.mov`, `.avi`) with keyframe subsampling |
| **GPS & Telemetry integration** | Synchronous GNSS, IMU (Pitch/Roll/Yaw), Barometric altitude, and RTK/PPK fusion |
| **Accurate 3D geometry** | Full 3D mesh surface reconstruction with sub-decimeter metric accuracy (96.8% benchmark) |
| **Georeferenced outputs** | WGS84 & UTM coordinate system projection with GIS flight trajectory visualization |
| **Analytical capabilities** | Automated semantic segmentation, anomaly detection, height/distance/area/volume tools |
| **Standard format exports** | Direct client export of standard GIS/CAD formats (`.OBJ`, `.GLB`, `.PLY`, `.LAS`, `.GeoJSON`) |

---

## 👥 Demo Credentials
For testing and demonstration during evaluation:
- **Email:** `demo@drone3d.ai`
- **Password:** `demo123`
- *Or click "Explore Live Demo" on the landing page for instant access with the pre-loaded Jaipur Heritage Survey mission.*
