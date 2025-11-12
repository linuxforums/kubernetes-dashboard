# Contributing to Kubernetes Dashboard

Thank you for your interest in contributing to the Kubernetes Dashboard!

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/kubernetes-dashboard.git
   cd kubernetes-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

## Project Structure

```
kubernetes-dashboard/
├── frontend/              # Next.js frontend
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   └── package.json
├── backend/              # Express.js backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── kubernetes/   # Kubernetes client
│   │   └── index.ts      # Server entry
│   └── package.json
└── package.json          # Root package.json
```

## Coding Standards

- **TypeScript**: Use TypeScript for type safety
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS with glassmorphism classes
- **API**: Follow RESTful conventions
- **Error Handling**: Always handle errors gracefully

## Adding New Features

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add error handling
   - Update documentation if needed

3. **Test your changes**
   - Test with a real cluster (if available)
   - Test with mock data (demo mode)
   - Check for errors in console

4. **Submit a pull request**
   - Describe your changes
   - Reference any related issues
   - Add screenshots if UI changes

## UI Guidelines

- **Design**: Follow the dark glassy Apple-inspired design
- **Colors**: Use the existing color palette (blue, green, purple, orange)
- **Components**: Reuse existing components when possible
- **Responsive**: Ensure mobile/tablet compatibility

## API Guidelines

- **Routes**: Follow RESTful conventions
- **Error Handling**: Return consistent error responses
- **Mock Data**: Always provide fallback mock data for demo mode
- **Documentation**: Document new API endpoints

## Testing

- Test with real Kubernetes clusters
- Test with mock data (demo mode)
- Test error scenarios
- Test on different browsers

## Questions?

Feel free to open an issue for questions or discussions!

