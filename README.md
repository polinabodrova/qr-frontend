# QR Code Frontend Application

A modern, responsive Vue 3 application for creating and managing QR codes with comprehensive analytics.

## Features

- **QR Code Generation**: Create QR codes with custom URLs
- **UTM Parameter Builder**: Easily add UTM parameters for marketing campaigns
- **Live URL Preview**: See the final URL with UTM parameters in real-time
- **QR Code Download**: Download QR codes as PNG images
- **Short Links**: Copy short URLs for easy sharing
- **Analytics Dashboard**: View detailed scan statistics
- **Interactive Charts**: Visualize data with Chart.js
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + vue-chartjs
- **HTTP Client**: Axios

## Screenshots

### Home Page

- Clean form for creating QR codes
- URL input with validation
- Collapsible UTM parameter builder
- Live preview of generated QR code

### Codes List

- View all created QR codes
- Search functionality
- Quick stats overview (total scans)

### Analytics Dashboard

- Total and unique scan counts
- Time series chart (scans over time)
- Device breakdown chart (mobile, desktop, tablet)
- Browser breakdown chart (Chrome, Safari, Firefox, etc.)
- Date range filtering

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd qr-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
```

4. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Docker Deployment

### Using Docker Compose

```bash
docker-compose up -d
```

The application will be available at `http://localhost:80`

### Manual Docker Build

```bash
docker build -t qr-frontend .
docker run -p 80:80 \
  -e VITE_API_URL=http://your-backend-url \
  qr-frontend
```

## Project Structure

```
qr-frontend/
├── src/
│   ├── main.ts              # Application entry point
│   ├── App.vue              # Root component
│   ├── style.css            # Global styles
│   ├── router/
│   │   └── index.ts         # Vue Router configuration
│   ├── stores/
│   │   └── qrCodes.ts       # Pinia store for QR codes
│   ├── services/
│   │   └── api.ts           # Axios API client
│   ├── components/
│   │   ├── UrlInput.vue     # URL input component
│   │   ├── UtmBuilder.vue   # UTM parameter builder
│   │   ├── QrPreview.vue    # QR code preview component
│   │   ├── StatsSummary.vue # Statistics summary cards
│   │   ├── StatsChart.vue   # Chart components
│   │   └── DcmBuilder.vue   # DCM parameter builder
│   └── views/
│       ├── HomeView.vue     # Home page with QR creation
│       ├── CodesListView.vue # List of all QR codes
│       └── CodeDetailView.vue # Detailed view with analytics
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf              # Nginx configuration for production
└── package.json            # Project dependencies
```

## Components

### UrlInput

Handles URL input with validation for http/https protocols.

### UtmBuilder

Collapsible form for adding UTM parameters:

- Source (e.g., newsletter, social)
- Medium (e.g., email, twitter)
- Campaign (e.g., summer2026)
- Content (e.g., banner)
- Term (e.g., keywords)

### QrPreview

Displays the generated QR code and provides download options.

### StatsSummary

Shows summary cards with:

- Total scans
- Unique scans
- Top device
- Top browser

### StatsChart

Renders interactive charts using Chart.js:

- Line chart for time series data
- Doughnut chart for device breakdown
- Bar chart for browser breakdown

## API Integration

The frontend communicates with the backend API via the `api.ts` service:

```typescript
// Base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL

// Example API calls
GET /api/qrcodes           # Get all QR codes
POST /api/qrcodes          # Create QR code
GET /api/qrcodes/:id       # Get specific QR code
PUT /api/qrcodes/:id       # Update QR code
DELETE /api/qrcodes/:id    # Delete QR code
GET /api/qrcodes/:id/stats # Get statistics
GET /api/qrcodes/:id/qrcode # Get QR code image
```

## Routing

The application uses Vue Router with three main routes:

| Path         | Component      | Description                        |
| ------------ | -------------- | ---------------------------------- |
| `/`          | HomeView       | Create new QR codes                |
| `/codes`     | CodesListView  | View all QR codes                  |
| `/codes/:id` | CodeDetailView | View QR code details and analytics |

## State Management

Pinia store (`qrCodes.ts`) manages:

- List of QR codes
- Current selected QR code
- Loading states
- Error states

## Styling

The application uses Tailwind CSS for styling. Key design decisions:

- **Color Scheme**: Blue primary color with neutral grays
- **Typography**: System fonts for optimal performance
- **Responsive**: Mobile-first approach with breakpoints
- **Components**: Reusable Tailwind utility classes

### Custom Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        // ... other custom colors
      },
    },
  },
  plugins: [],
};
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
```

## Environment Variables

| Variable       | Required | Description                  |
| -------------- | -------- | ---------------------------- |
| `VITE_API_URL` | Yes      | Base URL for the backend API |

## Usage Examples

### Creating a QR Code

1. Navigate to the home page
2. Enter a destination URL (e.g., `https://example.com`)
3. Click "Add UTM Parameters" to expand the UTM builder
4. Fill in UTM parameters as needed
5. Click "Generate QR Code"
6. Download the QR code or copy the short link

### Viewing Analytics

1. Navigate to "My Codes" page
2. Click on any QR code to view details
3. Use the date range filter to specify a time period
4. View the interactive charts showing scan data

### Editing a QR Code

1. Navigate to the detail view of a QR code
2. Click the "Edit" button
3. Modify the URL or UTM parameters
4. Save changes

### Deleting a QR Code

1. Navigate to the detail view of a QR code
2. Click the "Delete" button
3. Confirm deletion

## Build Process

The production build process:

1. **TypeScript Compilation**: `vue-tsc` checks for type errors
2. **Vite Build**: Bundles the application with code splitting
3. **Optimization**: Minifies JavaScript and CSS
4. **Asset Generation**: Creates optimized static assets

Output directory: `dist/`

### Build Output

```
dist/
├── index.html                  # Entry HTML
├── assets/
│   ├── index-[hash].css       # Minified CSS
│   └── index-[hash].js        # Minified JavaScript
```

## Performance Optimization

- **Code Splitting**: Automatic route-based code splitting via Vite
- **Tree Shaking**: Removes unused code
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: QR codes generated efficiently
- **Caching**: Browser caching for static assets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Error Handling

The application handles errors gracefully:

- **API Errors**: User-friendly error messages
- **Validation Errors**: Inline form validation
- **Network Errors**: Retry functionality
- **404 Errors**: Custom error pages

## Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliant

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run type checking: `npm run type-check`
5. Build the project: `npm run build`
6. Submit a pull request

## Development Tips

### Hot Module Replacement

Changes in development are reflected immediately without page reload.

### TypeScript Support

Full TypeScript support with auto-completion and type checking.

### Vue DevTools

Install Vue DevTools browser extension for debugging.

### API Testing

Use the backend API directly or tools like Postman for testing.

## Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will automatically use the next available port.

### API Connection Issues

Ensure the backend is running and `VITE_API_URL` is correctly set.

### Build Errors

Clear the node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- [ ] Dark mode support
- [ ] QR code customization (colors, logo)
- [ ] Bulk QR code generation
- [ ] Export analytics to CSV
- [ ] User authentication
- [ ] Offline support
- [ ] PWA capabilities

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
