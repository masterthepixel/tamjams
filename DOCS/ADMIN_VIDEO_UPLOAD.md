# Admin Video Upload Interface

**Status:** ✅ Ready to Use
**Access:** http://localhost:8000/admin/products

---

## Overview

The video upload interface allows merchants to upload product videos directly through a web UI. Videos are stored in the backend and automatically added to product media carousels on the storefront.

---

## How to Access

### Admin Dashboard
```
http://localhost:8000/admin/products
```

### Video Upload Page
```
http://localhost:8000/admin/products/[PRODUCT_ID]/videos
```

**Example:**
```
http://localhost:8000/admin/products/01ARZ3NDEKTSV4RRFFQ69G5FAV/videos
```

---

## Features

### 1. Product Selection
- Browse all available products
- Click "Manage Videos" to upload for that product

### 2. Drag & Drop Upload
- Drag video files directly onto the upload area
- Or click to select files from your computer

### 3. Multiple File Support
- Upload multiple videos at once
- Each video is stored separately

### 4. File Validation
- Supported formats: MP4, WebM, and other HTML5 video formats
- Maximum file size: 50MB
- Automatic error messages for invalid files

### 5. Upload Progress
- Progress bar shows upload status
- Visual feedback for success/errors

### 6. Video Management
- View all uploaded videos for a product
- Delete videos with one click
- File size and name displayed

---

## Video Requirements

### Format
- **Recommended:** MP4 (H.264 codec)
- **Alternative:** WebM, OGG, and other HTML5 formats
- **Best Browser Support:** MP4

### Size
- **Maximum:** 50MB per video
- **Recommended:** < 30MB for faster uploads
- **Encoding Tip:** Use HandBrake to compress videos

### Duration
- **Ideal:** 30 seconds to 5 minutes
- **Minimum:** At least 3 seconds
- **Maximum:** No hard limit (but longer = larger file)

### Resolution
- **Minimum:** 720p (1280×720)
- **Recommended:** 1080p (1920×1080)
- **Mobile:** 720p is sufficient for most devices

### Frame Rate
- **Standard:** 24-30 fps
- **Smooth Motion:** 60 fps (larger file size)
- **Typical:** 30 fps is industry standard

---

## How It Works

### Upload Process

1. **User uploads video**
   ```
   POST /api/admin/videos/upload
   - Video file in multipart form
   - Product ID
   ```

2. **Server processes**
   - Validates file type and size
   - Generates unique filename with timestamp
   - Saves to `backend/static/` directory
   - Updates product metadata

3. **Product metadata updated**
   ```json
   {
     "metadata": {
       "videoUrls": "[\"\/static\/video-timestamp-productid.mp4\"]"
     }
   }
   ```

4. **Video appears on storefront**
   - Automatically included in product media carousel
   - Lazy-loaded for performance
   - Displays alongside product images

### File Storage

Videos are stored in the backend static directory:

```
backend/static/
├── video-1234567890-product-id.mp4
├── video-1234567891-product-id.webm
└── ...
```

URLs become:
```
/static/video-1234567890-product-id.mp4
```

---

## Best Practices

### Video Content
✅ **DO:**
- Show the product in use or action
- Include your brand or product name
- Use good lighting
- Keep videos short and engaging
- Include clear audio (if talking)
- Test on mobile devices

❌ **DON'T:**
- Use copyrighted music without permission
- Include watermarks or ads
- Shake the camera excessively
- Have long, boring sections
- Make videos too dark or blurry

### Technical
✅ **DO:**
- Use MP4 format for best compatibility
- Compress videos before uploading
- Test playback in different browsers
- Use clear, audible audio
- Keep file sizes under 30MB

❌ **DON'T:**
- Upload uncompressed video files
- Use unsupported formats
- Upload extremely large files (>50MB)
- Forget to test on mobile

---

## Creating Videos

### Option 1: Smartphone
1. Record on your phone (portrait or landscape)
2. Transfer to your computer
3. Edit with free software (iMovie, Photos app)
4. Compress with HandBrake
5. Upload via admin interface

### Option 2: Free Tools
- **Recording:** OBS Studio (free & powerful)
- **Editing:** Shotcut, DaVinci Resolve, OpenShot
- **Compression:** HandBrake, ffmpeg
- **Online:** Clipchamp, Canva

### Option 3: Professional
- Hire a videographer
- Use stock video footage (Pexels, Pixabay)
- Combine clips with editing software

---

## Troubleshooting

### Upload Fails

**"File size exceeds 50MB limit"**
- Use HandBrake to compress
- Reduce video duration
- Lower resolution

**"File must be a video"**
- Check file format (must be MP4, WebM, etc.)
- Don't upload image files

**"Upload failed"**
- Check network connection
- Try a smaller file first
- Refresh and try again

### Video Not Appearing

**"Video uploaded but doesn't show"**
1. Hard refresh browser (Ctrl+Shift+R)
2. Check product page - it may be cached
3. Verify video file exists in `backend/static/`
4. Check browser console for errors

**"Video plays but looks low quality"**
- Video may have been compressed during upload
- Try uploading at higher resolution
- Check if file was corrupted during transfer

### Performance Issues

**"Videos causing page to load slowly"**
- Videos are lazy-loaded (shouldn't happen)
- Check network throttling in DevTools
- May be network issue, not video file

**"Video stutters during playback"**
- Check your internet speed
- Try MP4 format instead of WebM
- Reduce video bitrate

---

## Video Examples

See `DOCS/MEDIA_EXAMPLES.md` for:
- Sample video creation guide
- Video compression tutorials
- Video tool recommendations
- Example video scripts

---

## API Reference

### Upload Endpoint

```http
POST /api/admin/videos/upload
Content-Type: multipart/form-data

- video: File (required)
- productId: string (required)
```

**Response:**
```json
{
  "success": true,
  "id": "video-1234567890-product-id.mp4",
  "url": "/static/video-1234567890-product-id.mp4",
  "filename": "my-video.mp4",
  "size": 12345678
}
```

### Delete Endpoint

```http
DELETE /api/admin/videos/[videoId]
```

**Response:**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

## Security Notes

### File Upload
- Only video files accepted (MIME type validation)
- Maximum file size enforced (50MB)
- Filenames sanitized with timestamp
- Stored outside web root

### Access Control
- No authentication required currently
- **TODO:** Add admin authentication in production
- **TODO:** Add user role-based access

### Performance
- Lazy-loaded on storefront (minimal page impact)
- Videos only download when user interacts
- No automatic autoplay

---

## Future Enhancements

### Planned Features
- [ ] Video compression on upload
- [ ] Automatic poster image generation
- [ ] Video trimming before upload
- [ ] Batch upload support
- [ ] Video preview before upload
- [ ] Drag-to-reorder videos
- [ ] Video metadata editor (title, description)

### Possible Integrations
- [ ] YouTube/Vimeo embedding
- [ ] HLS/DASH streaming
- [ ] Video analytics (plays, completion rate)
- [ ] Video captions/subtitles
- [ ] Admin authentication
- [ ] Video CDN integration

---

## Step-by-Step Walkthrough

### Adding Videos to a Product

#### Step 1: Go to Products Page
```
http://localhost:8000/admin/products
```

#### Step 2: Select Product
- Find your product in the list
- Click "Manage Videos" button

#### Step 3: Upload Video
- Drag video onto upload area, OR
- Click "select files" button
- Choose video from your computer

#### Step 4: Wait for Upload
- Progress bar shows upload status
- Wait for "Successfully uploaded" message

#### Step 5: Verify on Storefront
- Go to product page
- Scroll to media carousel
- Video should appear alongside images

---

## FAQ

**Q: Can I upload multiple videos?**
A: Yes! Upload as many as you want. All will appear in the carousel.

**Q: Can I reorder videos?**
A: Not yet - videos appear in upload order. Future feature coming.

**Q: What if I delete a video?**
A: It's removed from the carousel immediately. Can re-upload anytime.

**Q: Do videos autoplay?**
A: No - users must click play. This respects user intent and saves bandwidth.

**Q: Can I use YouTube videos?**
A: Not yet - upload MP4/WebM files only. YouTube embedding coming in future.

**Q: Are videos compressed?**
A: No - uploaded as-is. Compress beforehand for faster uploads.

**Q: Can customers upload videos?**
A: Not currently. Only admin/merchant uploads. User-generated content coming later.

---

## Support

For questions or issues:
1. Check this documentation
2. See `DOCS/MEDIA_EXAMPLES.md` for video creation tips
3. Review `DOCS/DEV_GUIDE_VIDEOS.md` for technical details
4. Contact development team

---

**Last Updated:** March 5, 2026
**Status:** Production Ready
