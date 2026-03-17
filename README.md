# 🎬 ViralForge

> **Create. Edit. Share. Discover.**

---

## Backend Repo :
[👆 Click for Backend](https://github.com/astrospkc/ViralForge-backend)

## 🤔 What is ViralForge?

**ViralForge** is a platform where you can upload your videos, chop them into short clips (like Reels or TikToks), and share them with the world — all in one place. Think of it as your personal video studio combined with a social sharing platform.

But that's not all. ViralForge also brings something new to the table — a **food discovery feature** powered by video. Imagine scrolling through mouth-watering food videos, swiping right on a dish you love, and being taken straight to the restaurant where you can order it. It's like Tinder, but for food! 🍕

---

## 💡 What Does ViralForge Do?

ViralForge is a **video-first platform** where professionals and businesses can showcase their products, services, and work through **proof-based video content** — think real demos, client work, service walkthroughs, and project showcases.

Users can also **discover services and products** through short-form videos, and leave reviews to help others make better decisions.

> Upload proof of your work → Let others discover and evaluate → Build trust through video.

---

## 🔑 Core Features

- **Video Showcase** — Professionals and businesses upload proof-based videos (demos, case studies, service walkthroughs) to establish credibility.
- **Short-form Discovery** — Users explore a scrollable feed of short clips to find and evaluate services/products quickly.
- **Review System** — Users can rate and review services after watching content, adding a trust layer beyond just video.
- **HLS Streaming** — Uploaded videos are transcoded into [HLS (HTTP Live Streaming)](https://developer.apple.com/streaming/) format with multiple quality levels (360p, 720p, 1080p). This enables adaptive bitrate playback — the video quality automatically adjusts based on the viewer's network speed, similar to how YouTube and Netflix work.

---

## 🛠️ Approach & Architecture

This is a relatively simple application. Here's a quick overview of how the major pieces fit together:

### Video Upload & Transcoding
1. User uploads a raw video from the frontend.
2. The backend stores the original file and triggers a **transcoding pipeline**.
3. FFmpeg processes the video into HLS segments (`.m3u8` playlist + `.ts` chunks) at multiple resolutions.
4. Transcoded files are stored (e.g., S3 or local storage) and served via a streaming URL.
5. The frontend uses an HLS-compatible player (e.g., `hls.js`) to play the adaptive stream.

### Discovery Feed
- Short-form videos surface in a scrollable feed.
- Each video card links to a profile/service page with more details and reviews.

### Review System
- After viewing a service/product video, users can submit a rating and written review.
- Reviews are tied to the service provider's profile.

---

## 🧩 Who Is This For?

- **Freelancers & Agencies** — Show real client work and project results instead of just listing services.
- **Small Businesses** — Let potential customers see your product or service in action before reaching out.
- **Service Buyers** — Discover and evaluate providers through actual video proof, not just text descriptions.

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** [ViralForge Backend Repo](https://github.com/astrospkc/ViralForge-backend)
- **Video Processing:** FFmpeg → HLS transcoding pipeline
- **Streaming:** Adaptive bitrate via HLS (`.m3u8` + `.ts` segments)
- **Storage:** Cloud object storage for video segments

---

*Built with ❤️ by the ViralForge Team*
