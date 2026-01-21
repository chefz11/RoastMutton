# Favicon Setup Instructions

## Current Status
A temporary SVG Ring favicon has been created at `/public/favicon.svg`.

## To Use Your Ring Image

1. Save your Ring image (the one with Elvish script on gold ring) to this directory as:
   - `favicon.png` (original size)

2. Generate multiple sizes using a favicon generator:
   - **Recommended tool**: https://realfavicongenerator.net/
   - **Alternative**: https://favicon.io/

3. The generator will create:
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png` (180x180)
   - `favicon.ico` (for older browsers)

4. Place all generated files in the `/public` directory

5. The `index.html` already has the proper `<link>` tags configured to use these favicons.

## Quick Steps with RealFaviconGenerator

1. Go to https://realfavicongenerator.net/
2. Upload your Ring image
3. Review/customize the generated icons
4. Download the package
5. Extract all files to `/public` directory
6. You're done! The favicons will automatically work.

## Notes
- The current SVG will work as a fallback
- Modern browsers prefer SVG favicons (scalable and sharp at any size)
- PNG versions ensure compatibility with older browsers and devices
- The apple-touch-icon is used when users add your site to their home screen on iOS
