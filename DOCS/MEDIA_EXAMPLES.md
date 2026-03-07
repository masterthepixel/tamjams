# Product Media Examples & Sample Files

This document provides guidance on creating and using sample videos for testing and demonstration.

## Sample Video Files

### Included Examples

The Strawberry product includes example video URLs:

```json
{
  "title": "Tam's Jams - Strawberry",
  "handle": "tams-jams-strawberry",
  "videoUrls": [
    "/static/strawberry-demo.mp4",
    "/static/strawberry-usage.webm"
  ]
}
```

### Creating Test Videos

#### Option 1: Download Sample Videos

Use free sample videos from these sources:

**Free Video Sites:**
- [Pexels Videos](https://www.pexels.com/videos/) — CC0 license, free download
- [Pixabay Videos](https://pixabay.com/videos/) — CC0 license, free download
- [Coverr Videos](https://coverr.co/) — Free for personal/commercial use
- [Videvo](https://www.videvo.net/) — Free stock footage

**Search for:**
- "jam" or "jam spread" videos
- "toast" or "breakfast" videos
- "food" or "fruit" videos

#### Option 2: Record Your Own Video

Using your phone or webcam:

1. **Record the video**
   - Open your phone's camera app
   - Record a 30-90 second video
   - Ensure good lighting
   - Keep steady (use tripod if possible)

2. **Edit on your computer**
   - **Windows:** Photos app (built-in), or HandBrake
   - **Mac:** iMovie (built-in), or QuickTime
   - **Linux:** Shotcut or OpenShot

3. **Export as MP4**
   - Set resolution to 720p (1280×720)
   - Keep under 50MB
   - Use H.264 codec (most compatible)

#### Option 3: Use Commercial Footage

If you want professional videos:

- **Fiverr/Upwork:** Hire someone to record/edit
- **Local videographer:** Often cheaper than you'd think
- **DIY with proper equipment:** Phone + ring light + tripod = great results

### Video Specifications

| Aspect | Specification | Why |
|--------|---------------|-----|
| Format | MP4 (H.264) | Works on all browsers and devices |
| Resolution | 1280×720 (720p) | Balance between quality and file size |
| Frame Rate | 24-30 fps | Smooth playback without huge files |
| Bitrate | 2-5 Mbps | Acceptable quality for video streaming |
| Audio | Optional | Many users watch muted; add captions if including audio |
| Duration | 30-90 seconds | Keep viewer engagement high |
| File Size | < 50MB | Fast loading, reasonable bandwidth usage |

### Tools for Creating Videos

#### Free Tools

**Video Recording:**
- **OBS Studio** — Professional live streaming/recording tool
- **Windows Photos** — Simple recording on Windows
- **QuickTime** — Simple recording on Mac

**Video Editing:**
- **DaVinci Resolve** — Professional editing, free version
- **Shotcut** — User-friendly editing
- **OpenShot** — Simple timeline editor
- **Lightworks** — Professional editing, free version

**Video Conversion/Compression:**
- **HandBrake** — Convert and compress videos
- **ffmpeg** — Command-line tool (powerful)
- **MediaInfo** — Check video specs

#### Paid Tools (Optional)

- **Adobe Premiere** — Industry standard
- **Final Cut Pro** — macOS professional editing
- **DaVinci Resolve Studio** — Professional features, ~$295
- **Clipchamp** — Online editing

### Converting/Compressing Videos

#### Using HandBrake (Free, Easiest)

1. Download [HandBrake](https://handbrake.fr/)
2. Open your video file
3. Select "Fast 720p30" preset
4. Click "Start Encode"
5. Result: MP4 file, ~30-50MB for 90 sec video

#### Using ffmpeg (Free, Powerful)

```bash
# Install ffmpeg
# macOS: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg
# Windows: Download from ffmpeg.org

# Compress video to < 50MB
ffmpeg -i input.mov \
  -c:v libx264 \
  -crf 28 \
  -s 1280x720 \
  -r 30 \
  output.mp4

# Crop video to specific duration
ffmpeg -i input.mp4 \
  -t 60 \
  -c copy \
  output_60sec.mp4

# Extract poster image (3 seconds in)
ffmpeg -i video.mp4 -ss 00:00:03 -vframes 1 poster.jpg
```

### Creating Video Posters (Thumbnails)

A poster image shows before the video plays.

#### Extract from Video

```bash
# Get a frame at 3 seconds
ffmpeg -i video.mp4 -ss 00:00:03 -vframes 1 poster.jpg
```

#### Compress Poster Image

```bash
# Using ImageMagick
convert poster.jpg -resize 1280x720 -quality 80 poster-optimized.jpg

# For WebP (smaller):
ffmpeg -i poster.jpg -quality 80 poster.webp
```

#### Good Poster Characteristics

- ✅ Shows product clearly
- ✅ Bright and appetizing
- ✅ Has recognizable play button visible
- ✅ High contrast
- ✅ Shows action/context
- ✅ 16:9 or square aspect ratio
- ✅ < 500KB file size

### Example Video Recipes

Here are some video ideas you can create:

#### 1. Jam Spread Demo (30 seconds)

```
00:00 - Open jar, show label
00:05 - Scoop jam with spoon
00:10 - Spread on fresh toast
00:15 - Close-up of spread jam
00:20 - Take a bite
00:25 - Show flavor/freshness
00:30 - Closing shot of jar
```

**Tips:**
- Use natural sunlight
- Show the jam's color and texture clearly
- Use a nice plate/toast
- Include the branded label

#### 2. Usage/Recipe Video (60 seconds)

```
00:00 - Ingredients on table
00:10 - Prepare base (yogurt, pastry, etc.)
00:20 - Scoop jam
00:30 - Add jam to dish
00:40 - Mix or arrange
00:50 - Close-up of final dish
00:60 - Take a bite / serve
```

**Tips:**
- Use high-quality ingredients
- Show step-by-step clearly
- Use good lighting
- Include brand in frame

#### 3. Testimonial Video (30-45 seconds)

```
00:00 - Person introduces themselves
00:05 - Show jam jar (with label visible)
00:10 - Describe flavor and quality
00:20 - Show using product
00:30 - Conclude with recommendation
```

**Tips:**
- Record with good audio quality
- Use natural lighting (avoid shadows)
- Keep background clean
- Show genuine emotion

### Sample Video Folder Structure

```
backend/static/
├── strawberry-demo.mp4           # Main product demo
├── strawberry-demo.webm          # Alternative format
├── strawberry-demo-poster.jpg    # Poster image
├── strawberry-usage.mp4          # Recipe/usage video
├── strawberry-usage.webm
├── strawberry-usage-poster.jpg
├── blueberry-demo.mp4
├── blueberry-demo-poster.jpg
└── README.txt                    # Notes about each video
```

### README.txt Template

```
# Strawberry Demo Video

Source: Self-recorded (2026-02-15)
Duration: 45 seconds
Size: 12.5 MB
Format: MP4 (H.264, 1280x720, 30fps)
Poster: strawberry-demo-poster.jpg

Content: Shows opening jar, spreading on toast, tasting jam
Quality: Good lighting, clear focus, minimal background noise
Rights: Original content, no copyright issues

---

Compressed using: HandBrake preset "Fast 720p30"
Original file: ~/Videos/strawberry_demo_raw.mov (89 MB)
Compression ratio: 7x

---

Last updated: 2026-02-15
By: [Your Name]
```

## Testing Videos

### Manual Testing Checklist

After adding a video:

- [ ] Video appears in product gallery
- [ ] Correct thumbnail/poster displays
- [ ] Play button is visible
- [ ] Click play starts the video
- [ ] Video controls work (play/pause/volume/fullscreen)
- [ ] Video doesn't autoplay (respects user intent)
- [ ] Video loads smoothly (no buffering at start)
- [ ] Audio (if present) is clear
- [ ] Works on desktop browser
- [ ] Works on mobile browser
- [ ] Works on tablet
- [ ] Fullscreen works correctly
- [ ] Navigating away stops video playback
- [ ] Multiple videos can be navigated through

### Testing on Different Browsers

| Browser | Test | Status |
|---------|------|--------|
| Chrome | Play, fullscreen, audio | ✅ |
| Firefox | Play, fullscreen, audio | ✅ |
| Safari | Play, fullscreen, audio | ✅ |
| Edge | Play, fullscreen, audio | ✅ |
| Mobile Safari | Play, fullscreen | ✅ |
| Chrome Mobile | Play, fullscreen | ✅ |

### Testing on Different Devices

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet landscape (1024x768)
- [ ] Tablet portrait (768x1024)
- [ ] Phone landscape (812x375)
- [ ] Phone portrait (375x812)

## Accessibility Considerations

### Current Support
- ✅ Native video controls (accessible)
- ✅ Play/pause functionality
- ✅ Volume control
- ✅ Fullscreen support
- ✅ Keyboard navigation (tab/spacebar)

### Future Enhancements
- ⏳ Captions/subtitles (WebVTT format)
- ⏳ Audio descriptions
- ⏳ Keyboard-only playback controls

### Best Practices Now
- Ensure audio is clear (good microphone)
- Keep videos short and engaging
- Use visual demonstrations (don't rely solely on audio)
- Test on accessibility tools (WebAIM, NVDA)

## Performance Optimization

### Video Lazy Loading

Videos use lazy loading for performance:

```
Page Load:
- Images load immediately
- Videos load on demand (when user clicks thumbnail)
- Poster images load as thumbnails

User Navigation:
- Hovering over video thumbnail: load video metadata
- Clicking play: load full video
- Switching to another media: pause current video
```

### File Size Impact

| Item | Size | Impact |
|------|------|--------|
| Poster image (1280x720) | 100-200 KB | Minimal (loads with thumbnails) |
| Video (90 sec, 720p) | 20-40 MB | Lazy loaded, not on initial pageload |
| 5 videos per product | 150-200 MB | Only active video streams |

### Compression Results

Example: Recording to final file

```
Original recorded file (iPhone video): 850 MB
After HandBrake compression: 35 MB
File size reduction: 96%
Video duration: 90 seconds
Final bitrate: ~3.2 Mbps (good quality)
```

## Common Video Issues & Solutions

### Video plays but has no sound
- Ensure source video has audio track
- Check browser mute state
- Try different audio codec

### Video is extremely slow to load
- Reduce bitrate (use HandBrake preset "Very Fast 720p")
- Reduce video duration
- Ensure file is actually < 50MB
- Consider using external CDN

### Video file corrupted
- Re-export/re-record the video
- Try different export format
- Use ffmpeg to repair: `ffmpeg -i bad.mp4 -c copy fixed.mp4`

### Can't play WebM format
- Use MP4 instead (better browser support)
- WebM requires specific browser versions
- MP4 works on all modern browsers

### Poster image shows wrong frame
- Extract new poster at different timestamp
- Create custom poster image
- Edit video to have better opening frame

## Resources & Links

### Video Tools
- [HandBrake](https://handbrake.fr/) — Video compression
- [ffmpeg](https://ffmpeg.org/) — Command-line video tool
- [OBS Studio](https://obsproject.com/) — Recording/streaming
- [DaVinci Resolve](https://www.davinciresolve.com/) — Video editing

### Free Stock Video
- [Pexels Videos](https://www.pexels.com/videos/)
- [Pixabay Videos](https://pixabay.com/videos/)
- [Coverr](https://coverr.co/)
- [Videvo](https://www.videvo.net/)

### Learning Resources
- [YouTube: How to Record Product Videos](https://www.youtube.com/results?search_query=how+to+record+product+demo+video)
- [YouTube: Video Compression Tutorial](https://www.youtube.com/results?search_query=handbrake+tutorial)

### Documentation
- [Developer Guide](./DEV_GUIDE_VIDEOS.md)
- [Merchant Guide](./MERCHANT_GUIDE_VIDEOS.md)
- [HTML5 Video Spec](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

---

**Last Updated:** 2026-03-05
**Questions?** Contact your development team
