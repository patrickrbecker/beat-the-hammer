# Beat the Hammer

A simple Next.js application that displays the Twitter feed from @BeatHammer.

## Features

- 🐦 **Live Twitter Feed**: Displays real-time tweets from @BeatHammer
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Built with Tailwind CSS and dark theme
- 🔗 **Direct Link**: Quick access to the full Twitter profile

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Twitter Integration**: Twitter Widgets API
- **Deployment**: Vercel

## Getting Started

### Local Development

1. Clone and navigate to the project:
   ```bash
   cd hammer-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

This app is configured for easy deployment on Vercel:

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Deploy automatically

Alternatively, deploy directly from your local machine:
```bash
npx vercel
```

## Twitter Integration

The app uses the official Twitter Widgets API to embed the live feed from @BeatHammer. The feed includes:

- Latest tweets from the account
- Dark theme for better visual integration
- Responsive design that works on all devices
- Fallback content when JavaScript is disabled

## Customization

- Modify the Twitter handle by updating the href in the twitter-timeline link
- Customize colors and styling in the Tailwind classes
- Adjust the number of tweets displayed with the `data-tweet-limit` attribute

## License

MIT License - feel free to use and modify as needed.
# Force rebuild Sat Jul 26 20:48:20 EDT 2025
