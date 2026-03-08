# Admin Interface - Quick Start Guide

## 🚀 Access Admin Panel

```
http://localhost:8000/admin
```

---

## 📹 Upload a Video in 3 Steps

### Step 1: Go to Products
Click "Manage Products" or visit:
```
http://localhost:8000/admin/products
```

### Step 2: Select a Product
Find your product (e.g., "Tam's Jams - Strawberry") and click **"Manage Videos"**

### Step 3: Upload Video
- **Option A:** Drag video file onto the upload area
- **Option B:** Click "select files" and choose from your computer
- Wait for upload to complete
- See "Successfully uploaded" message

---

## ✅ That's It!

The video will automatically appear in your product's media carousel on the storefront.

---

## 📋 Video Requirements

| Requirement | Details |
|---|---|
| **Format** | MP4, WebM, or other HTML5 formats |
| **Size** | Max 50MB per video |
| **Duration** | 30 seconds to 5 minutes ideal |
| **Resolution** | 720p (1280×720) minimum |

---

## 💡 Tips

**Before Uploading:**
- Compress your video if larger than 30MB (use HandBrake - free)
- Test on your phone to verify quality
- Keep it short and engaging

**After Uploading:**
- Hard refresh your browser (Ctrl+Shift+R) to see changes
- Videos appear alongside product images automatically
- Videos are lazy-loaded (won't slow down page)

---

## ❓ Troubleshooting

**"Upload failed"**
- Check file size is under 50MB
- Ensure it's a valid video format (MP4, WebM)
- Try uploading a smaller video first

**"Video doesn't appear on storefront"**
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check the admin page - it should list your video
- Check browser console for errors

**"Video is too large"**
- Download HandBrake (free video compressor)
- Open your video
- Select "Fast 720p30" preset
- Click "Start Encode"
- Upload the compressed version

---

## 🎬 Free Tools

**Compression:**
- [HandBrake](https://handbrake.fr/) - Best option

**Recording:**
- Your phone camera
- OBS Studio (free)

**Editing:**
- Shotcut (free)
- DaVinci Resolve (free)

**Stock Videos:**
- [Pexels Videos](https://www.pexels.com/videos/)
- [Pixabay Videos](https://pixabay.com/videos/)

---

## 📖 More Information

- **Admin Documentation:** `DOCS/ADMIN_VIDEO_UPLOAD.md`
- **Video Creation Guide:** `DOCS/MEDIA_EXAMPLES.md`
- **Developer Guide:** `DOCS/DEV_GUIDE_VIDEOS.md`

---

**Happy uploading! 🎉**
