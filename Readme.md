### Logistics Cargo Tracking System

## Overview

Cargo Tracking System is a comprehensive web application built with Vue.js that allows customers to track their shipments in real-time. The system provides detailed information about package location, estimated delivery times, and shipping history. It also includes an admin dashboard for managing packages and updating their status.

## Features

### Customer-Facing Features

- **Real-time Tracking**: Track packages using tracking or dispatch numbers
- **Detailed Package Information**: View current location, next stop, and final destination
- **Shipping Progress**: Visual timeline of package movement history
- **Responsive Design**: Optimized for both desktop and mobile devices


### Admin Features

- **Package Management**: Add, edit, and view package details
- **Location Updates**: Update package location with automatic next stop calculation
- **Shipping Address Management**: Edit recipient shipping information
- **Tracking History**: Add and manage tracking stops with timestamps
- **Secure Admin Access**: Password-protected admin area


## Technology Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Styling**: Tailwind CSS
- **Routing**: Vue Router
- **Icons**: Lucide Vue
- **TypeScript**: For type safety and better developer experience


## Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn


### Setup Instructions

1. Clone the repository


```shellscript
git clone https://github.com/your-username/texmon-logistics.git
cd texmon-logistics
```

2. Install dependencies


```shellscript
npm install
# or
yarn install
```

3. Start the development server


```shellscript
npm run dev
# or
yarn dev
```

4. Build for production


```shellscript
npm run build
# or
yarn build
```

## Project Structure

```plaintext
texmon-logistics/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Reusable Vue components
│   │   ├── ui/              # UI components (Button, Card, etc.)
│   │   └── ...              # Other components
│   ├── data/                # Mock data and location information
│   ├── router/              # Vue Router configuration
│   ├── types/               # TypeScript type definitions
│   ├── views/               # Page components
│   ├── App.vue              # Root component
│   └── main.ts              # Application entry point
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Usage

### Customer Tracking

1. Navigate to the home page
2. Click on "Track Cargo" or go to the tracking page
3. Enter your tracking or dispatch number
4. View detailed information about your package


### Admin Access

1. Navigate to the admin page
2. Login with the following credentials:

1. Username: `admin`
2. Password: `texmon2024`



3. Manage packages through the admin dashboard


## API Integration

The current version uses mock data for demonstration purposes. To connect to a real backend:

1. Create API service files in `src/services/`
2. Replace mock data calls with API calls
3. Update environment variables for different environments


Example API service:

```typescript
// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getPackage = async (trackingNumber: string) => {
  try {
    const response = await apiClient.get(`/packages/${trackingNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching package:', error);
    throw error;
  }
};

// Add more API methods as needed
```

## Deployment

### Hosting Options

1. **Vercel**

1. Connect your GitHub repository
2. Vercel will automatically detect Vue.js and deploy



2. **Netlify**

1. Connect your GitHub repository
2. Set build command to `npm run build`
3. Set publish directory to `dist`



3. **Traditional Hosting**

1. Run `npm run build`
2. Upload the contents of the `dist` folder to your web server





## Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
VITE_API_URL=https://api.example.com
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Vue.js](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vite](https://vitejs.dev/)


## Contact

Texmon Logistics - [enquiries@texmonlogistics.co.ke](mailto:enquiries@texmonlogistics.co.ke)

Project Link: [https://github.com/tmm-tech/Track-Cargo](https://github.com/tmm-tech/Track-Cargo)

---

© 2024 Texmon Logistics Limited. All Rights Reserved.
