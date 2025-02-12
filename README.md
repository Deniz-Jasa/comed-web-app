# Comed - Automated ER Triage System and Physician AI Assistant

This web application enables healthcare providers to manage patient care, track medical records, and streamline emergency room workflows.

## Features

### 🏥 Dashboard
- Real-time patient monitoring
- Statistical overview of patient distribution
- Triage level tracking
- Staff management and scheduling
- Interactive charts and analytics

### 👥 Patient Management
- Comprehensive patient records
- Advanced search and filtering
- Triage level assignment
- Patient status tracking
- Visit history

### 🔬 Clinical Support
- AI-powered diagnostic assistance
- Research paper integration
- Structured consultation notes
- Treatment plan management
- Risk assessment tools

### 💻 Technical Features
- Modern, responsive UI
- Real-time updates
- Secure data handling

## Tech Stack

- **Framework**: Next.js 13
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **AI Integration**: Cohere AI
- **Icons**: Lucide React

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables:

```bash
COHERE_API_KEY=your_cohere_api_key
```

## Project Structure

```
├── app/
│   ├── api/         # API routes
│   ├── patients/    # Patient management
│   └── settings/    # Application settings
├── components/      # Reusable components
├── lib/            # Utilities and helpers
└── public/         # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework
- [Vercel](https://vercel.com/) for hosting and deployment
