# How to Add Videos to Products - Merchant Guide

This guide shows you how to add product videos (demos, usage clips, testimonials) to your Tam's Jams products.

## Video Requirements

### Supported Formats
- **MP4** (.mp4) — Recommended, works on all browsers
- **WebM** (.webm) — Modern browsers, smaller file size

### Video Specifications
| Spec | Requirement |
|------|-------------|
| Size | < 50MB (ideally < 20MB) |
| Duration | 30 seconds - 5 minutes |
| Resolution | 720p (1280×720) minimum |
| Frame rate | 24-30 fps |
| Audio | Optional (many users watch muted) |

## Adding Videos via JSON (Current Method)

### Step 1: Place video file on the server

1. Create a `.mp4` or `.webm` file of your product video
   - Keep it under 50MB
   - Use 720p resolution
   - Trim to 30 seconds - 5 minutes

2. Place the video file in the server storage directory:
   ```
   backend/static/video-filename.mp4
   ```

### Step 2: Edit product data file

1. Open the product data file:
   ```
   DOCS/product-data.json
   ```

2. Find your product (e.g., "Tam's Jams - Strawberry")

3. Add the `videoUrls` array:
   ```json
   {
     "title": "Tam's Jams - Strawberry",
     "handle": "tams-jams-strawberry",
     "description": "Delicious homemade strawberry jam...",
     "flavor": "Strawberry",
     "ingredients": ["Strawberries", "Cane Sugar", ...],
     "videoUrls": [
       "/static/strawberry-demo.mp4",
       "/static/strawberry-usage.webm"
     ],
     // ... other fields
   }
   ```

### Step 3: Run the seed script

After editing the product data file, run:

```bash
cd backend
pnpm seed:products     # Create/update products
pnpm update:metadata   # Update with video URLs
```

### Step 4: Verify videos appear

1. Visit your storefront: `http://localhost:8000/us/products/[product-handle]`
2. Scroll to the product gallery
3. Look for video thumbnails with a play button icon
4. Click to play the video

## Video Best Practices

### What Makes Good Product Videos

✅ **DO:**
- Show product in use (on toast, in a recipe, etc.)
- Keep it short and engaging (30-60 seconds)
- Use natural lighting
- Include product packaging/label
- Add captions (help accessibility)
- Keep background clean and minimal

❌ **DON'T:**
- Make it too long (people lose interest)
- Use distracting background music
- Have shaky camera
- Show irrelevant scenes
- Have poor audio quality
- Use copyrighted music without permission

### Video Ideas for Jam Products

1. **Demo Video** (30-60 sec)
   - Open jar
   - Spread on toast
   - Take a bite
   - Show flavor/texture

2. **Usage Video** (60-90 sec)
   - Recipe: Use jam in pancakes
   - Use in yogurt parfait
   - Use in pastries/baking
   - Use on breakfast foods

3. **Testimonial Video** (30 sec)
   - Customer talking about flavor
   - Family enjoying product
   - How they use it regularly

### Video Thumbnails (Posters)

A video thumbnail (poster image) shows before the video plays. Currently, this uses the video's first frame.

**To set a custom poster:**
1. Create an image from your video (3-5 seconds in)
2. Save as a JPEG or WebP file
3. Place in `backend/static/`
4. (Technical team) Update product metadata to include poster URL

**Good poster characteristics:**
- Shows the jam clearly
- Bright and appetizing
- Has play button visible
- Same aspect ratio as video (16:9 or square)

## Video Order on Product Page

Videos appear **after images** in the product carousel. Order within the list is preserved.

**Example order:**
1. Product image #1
2. Product image #2
3. Demo video
4. Usage video

To change the order, simply reorder the arrays in `product-data.json`.

## External Videos (CDN/Hosted)

If your videos are hosted on an external server (like Vimeo or AWS S3):

```json
{
  "videoUrls": [
    "https://example-cdn.com/strawberry-demo.mp4",
    "https://example-cdn.com/strawberry-usage.mp4"
  ]
}
```

**Note:** Always use HTTPS for external URLs for security.

## YouTube Videos (Future Feature)

Currently, we don't support embedded YouTube videos. This is planned for a future update.

**Workaround:** Download the video as MP4 and add it locally.

## Mobile Experience

Videos work on all devices:
- **Desktop:** Full controls, click to play
- **Tablet:** Thumbnail navigation, portrait/landscape mode
- **Mobile:** Touch-friendly controls, fullscreen support

**Tips for mobile:**
- Test video playback on actual mobile devices
- Ensure video size isn't too large (affects data usage)
- Keep videos short (mobile users have less patience)
- Verify fullscreen works correctly

## Troubleshooting

### Video doesn't appear

**Check 1: File exists**
```bash
# Ask your developer to verify:
ls -la backend/static/your-video.mp4
```

**Check 2: JSON is valid**
- Use a JSON validator: [jsonlint.com](https://www.jsonlint.com)
- Check for missing commas or quotes

**Check 3: Seed script ran**
- Ask developer to run: `pnpm seed:products && pnpm update:metadata`

### Video won't play

**Possible causes:**
1. Video format not supported (try MP4)
2. Video file is corrupted
3. Server can't find the file
4. Browser doesn't support format (try another browser)

**Solutions:**
1. Try converting to MP4 format
2. Re-record or download the video again
3. Double-check file path in JSON
4. Try in Chrome or Firefox instead

### Video is very slow

**Possible causes:**
1. Video file is too large
2. Network connection is slow
3. Server is overloaded

**Solutions:**
1. Compress video (use HandBrake or ffmpeg)
2. Use external CDN for video hosting
3. Contact your hosting provider

### Video plays with no sound

This is often intentional (users watch muted). You can:
1. Add captions to communicate without audio
2. Add music to the video (ensure no copyright issues)
3. Ask your developer to improve audio quality

## Video Analytics (Future)

We're planning to track:
- How many users watch each video
- How far into the video they watch
- Which videos drive the most sales

This will help you understand which product videos are most effective.

## Frequently Asked Questions

**Q: Can I use videos from YouTube directly?**
A: Not yet. Download them as MP4 and add locally.

**Q: What if my video is too large?**
A: Compress it using HandBrake (free) or ask your developer for help.

**Q: Can I have different videos for different variants?**
A: Currently, all variants share the same videos. Each product can have multiple videos shown together.

**Q: How many videos can I add?**
A: As many as you want! The gallery can handle 10+ videos without problems.

**Q: Can I add captions/subtitles?**
A: Not yet, but it's planned for a future update.

**Q: Do videos affect page load time?**
A: No, videos are lazy-loaded (don't load until the user navigates to them).

**Q: Can customers upload their own videos?**
A: Not yet, but this is a planned future feature.

**Q: How do I delete a video?**
A: Remove it from the `videoUrls` array in `product-data.json` and run the seed script again.

**Q: Can I have different videos for different countries?**
A: Currently no, but you can update videos manually per region if needed.

## Getting Help

### For Video Recording/Editing
- **Free tools:** OBS Studio, Shotcut, DaVinci Resolve
- **Paid tools:** Adobe Premiere, Final Cut Pro
- **Online:** Canva, Clipchamp

### For Video Compression
- **HandBrake** (free) — Easy video compression
- **ffmpeg** (free, command-line) — Advanced video editing
- **TinyCompress** (online) — Quick compression

### For Getting Help
1. Ask your developer
2. Check the Developer Guide: [DEV_GUIDE_VIDEOS.md](./DEV_GUIDE_VIDEOS.md)
3. Review the Feature Specification: [DOCS/FEATURES/product-media-carousel.md](../FEATURES/product-media-carousel.md)

## Summary Checklist

Before adding a video:
- [ ] Video is MP4 format (or WebM)
- [ ] Video is < 50MB
- [ ] Video is 30-90 seconds
- [ ] Video quality is good (720p+)
- [ ] Video has clear, well-lit product
- [ ] File is saved in `backend/static/`
- [ ] `product-data.json` updated with correct path
- [ ] Seed scripts have been run
- [ ] Video appears and plays correctly

---

**Last Updated:** 2026-03-05
**Status:** Production Ready
**Help:** Contact your development team
