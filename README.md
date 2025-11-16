# CourseOS Landing Page

A modern, responsive landing page for selling online courses, styled to match the CourseOS Framer template design.

## Features

- ✨ Modern dark theme with purple gradient accents
- 📱 Fully responsive design
- 🎨 Matching color scheme and typography from the reference design
- 💳 Pricing cards with demo options
- 🎯 Clean and minimal UI
- ⚡ Smooth animations and transitions
- 🔍 SEO-friendly structure

## Design Elements

### Color Palette
- **Background**: Dark (#0a0a0a, #1a1a1a)
- **Purple Gradient**: #8B5CF6 → #EC4899
- **Text**: White (#ffffff) with gray variations for hierarchy

### Typography
- **Font**: Inter (Google Fonts)
- **Hero Title**: 64px, Bold
- **Section Titles**: 48px, Bold
- **Body Text**: 14-18px, Regular/Medium

### Key Sections
1. **Navigation Bar**: Logo, Login, Get Access
2. **Hero Section**: Main headline with CTA button
3. **Preview Section**: Course preview with gradient background
4. **Pricing Section**: Two-column pricing cards
5. **Footer**: Links and Framer branding

## Customization Guide

### Change Your Brand Name
Edit `index.html` line 25-28:
```html
<div class="logo-title">Your Brand</div>
<div class="logo-subtitle">Your Tagline</div>
```

### Update Colors
Edit `styles.css` root variables (lines 11-24):
```css
:root {
    --purple: #8B5CF6; /* Your primary color */
    --pink: #EC4899;   /* Your accent color */
}
```

### Modify Course Title
Edit `index.html` line 52:
```html
<h1 class="hero-title">Your Course Name</h1>
```

### Update Pricing
Edit the pricing cards in `index.html` (lines 85-157):
- Change prices
- Modify features
- Update plan names

### Add Course Preview Image
Replace the placeholder in the preview section:
- Save your image as `course-preview.png` in the same directory
- Or update the image path in `index.html` line 68

## File Structure

```
course-website/
├── index.html      # Main HTML structure
├── styles.css      # All styles and design
├── script.js       # Interactive features
└── README.md       # Documentation
```

## Running Locally

1. Simply open `index.html` in your web browser
2. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```
3. Visit `http://localhost:8000` in your browser

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Next Steps

1. **Add Your Content**: Replace placeholder text with your course details
2. **Add Images**: Add your course preview images
3. **Integration**: Connect buttons to your payment/signup system (Stripe, Gumroad, etc.)
4. **Deploy**: Host on Netlify, Vercel, or GitHub Pages
5. **Analytics**: Add Google Analytics or similar tracking

## Integration Ideas

- **Payment**: Stripe, PayPal, Gumroad
- **Email**: Mailchimp, ConvertKit
- **Authentication**: Auth0, Firebase Auth
- **CMS**: Contentful, Sanity
- **Hosting**: Netlify, Vercel, GitHub Pages

## License

Feel free to use this template for your course website!
