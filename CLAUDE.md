# CLAUDE.md - Studio IA Documentation

## Project Overview

**Studio Produit Marketing** is a French web application for professional product image processing and video generation. The application provides marketing teams with tools to create professional product visuals through various AI-powered treatments.

**Primary Purpose**: Enable marketing teams to transform product images into professional marketing assets through automated image processing and scene composition.

**Language**: The application is in French (comments, UI text, variable names often use French terminology).

## Tech Stack

- **Framework**: React 18.3.1 with TypeScript 5.5.3
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1 with custom theme
- **State Management**: React Context API with useReducer
- **UI Components**: Custom components + Lucide React icons
- **File Handling**: react-dropzone 14.3.8
- **Code Quality**: ESLint 9.9.1 with TypeScript ESLint

## Project Structure

```
studio-ia/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components (Button, Card, Input, Toast)
│   │   ├── AdminLogin.tsx
│   │   ├── ErrorNotification.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ProcessingStatus.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductInfoForm.tsx
│   │   ├── TreatmentSelector.tsx
│   │   ├── TreatmentWorkspace.tsx
│   │   ├── UploadZone.tsx
│   │   ├── VideoGenerationForm.tsx
│   │   ├── VideoGenerationPage.tsx
│   │   └── WebhookStatus.tsx
│   ├── contexts/
│   │   └── AppContext.tsx   # Global state management
│   ├── services/
│   │   ├── errorHandler.ts  # Error handling utilities
│   │   └── webhookService.ts # Webhook integration with n8n
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── utils/
│   │   └── cn.ts            # Utility functions (className helpers)
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type declarations
├── public/                   # Static assets
├── .bolt/                    # Bolt configuration
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TS config
├── tsconfig.node.json       # Node-specific TS config
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── eslint.config.js         # ESLint configuration
```

## Key Architecture Patterns

### State Management (src/contexts/AppContext.tsx)

The application uses React Context with useReducer for global state management:

**State Structure**:
- `theme`: Light/dark theme preference (persisted to localStorage)
- `products`: Array of uploaded files/products
- `selectedProduct`: Currently selected product
- `treatments`: Available treatment types with configuration
- `jobs`: Processing job queue
- `isProcessing`: Processing status flag
- `webhookConfig`: Webhook configuration for n8n integration
- `selectedTreatmentType`: Currently selected treatment
- `currentStep`: Current workflow step ('hero' | 'treatment')

**Available Actions**:
- `SET_THEME`: Update theme
- `ADD_PRODUCTS`: Add uploaded files
- `REMOVE_PRODUCT`: Remove a product
- `UPDATE_PRODUCT`: Update product metadata
- `SELECT_PRODUCT`: Select active product
- `CLEAR_PRODUCTS`: Clear all products
- `TOGGLE_TREATMENT`: Enable/disable treatment
- `UPDATE_TREATMENT_OPTIONS`: Update treatment parameters
- `START_PROCESSING`: Begin processing
- `ADD_JOB`: Add processing job
- `UPDATE_JOB`: Update job status
- `SET_WEBHOOK_CONFIG`: Configure webhook
- `SELECT_TREATMENT_TYPE`: Select treatment type
- `SET_CURRENT_STEP`: Navigate workflow steps

### Treatment Types

The application supports three main treatment types:

1. **Détourage Studio** (`background-removal`)
   - Professional packshot with white background
   - Badge: "Rapide" (Fast)
   - Options: shadowIntensity, sharpness, whiteBalance

2. **Mise en situation Packaging** (`scene-composition`)
   - Packaging integration in realistic environment
   - Badge: "Premium"
   - Options: environment, lighting

3. **Mise en situation Produit Brut** (`product-scene`)
   - Raw product integration in custom environment
   - Badge: "Nouveau" (New)
   - Options: environment, lighting

### Webhook Integration (src/services/webhookService.ts)

**Purpose**: Send image processing requests to n8n workflow automation.

**Key Features**:
- Singleton pattern for service instance
- Multi-image upload support
- Base64 encoding of images (without data URI prefix)
- JSON payload structure for n8n webhook

**Webhook URL**: `https://n8n.srv778298.hstgr.cloud/webhook/fb09047a-1a80-44e7-833a-99fe0eda3266`

**Payload Structure**:
```typescript
{
  client: 'Studio Produit',
  productName: string,
  productDescription: string,
  treatmentType: string,
  imagesBase64: string[],           // Array of base64 encoded images
  originalFileNames: string[],      // Original file names
  situationDescription: string      // Treatment-specific description
}
```

**Important**: The service converts File objects to pure base64 strings (without the `data:image/...;base64,` prefix) using the `toB64` utility function.

## Type System (src/types/index.ts)

### Core Types

**UploadedFile**: Represents an uploaded image file
- `id`: Unique identifier
- `file`: File object
- `preview`: Preview URL
- `status`: 'pending' | 'processing' | 'completed' | 'error'
- `name`, `description`, `code`, `promotion`: Optional metadata

**Product**: Product information
- `id`, `name`, `code`, `description`, `promotion`
- `image/images`: Single or multiple File objects
- `imageUrl/imageUrls`: Preview URLs

**Treatment**: Treatment configuration
- `id`: Treatment identifier
- `name`, `description`: Display information
- `icon`: Lucide icon name
- `badge`: Optional badge text
- `enabled`: Active status
- `options`: Treatment-specific parameters

**WebhookPayload**: Data sent to n8n
- `treatmentType`: Treatment identifier
- `productData`: Product information and images
- `treatmentParams`: Optional treatment parameters
- `timestamp`, `sessionId`: Request metadata

## User Workflow

1. **Hero Screen** (`currentStep: 'hero'`)
   - User lands on HeroSection component
   - Selects a treatment type

2. **Treatment Selection** (`currentStep: 'treatment'`)
   - Navigates to TreatmentWorkspace or VideoGenerationPage
   - Uploads images via UploadZone (react-dropzone)
   - Fills product information form
   - Configures treatment options

3. **Processing**
   - Application sends webhook request to n8n
   - Images converted to base64
   - Processing status tracked in state
   - Results displayed when available

## Development Workflows

### Available Scripts

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Development Server

- Runs on Vite's default port (typically 5173)
- Hot Module Replacement (HMR) enabled
- Fast refresh for React components

### Build Process

- TypeScript compilation with strict type checking
- Vite bundling and optimization
- Tailwind CSS purging for production
- Output to `dist/` directory

## Styling Conventions

### Tailwind Configuration

**Custom Theme**:
- Extended gray color palette (50-900)
- Custom font stack: `-apple-system, BlinkMacSystemFont, Inter, Segoe UI, Roboto`
- Custom animations: `spin`, `pulse`

**Usage Patterns**:
- Use `className` prop for Tailwind classes
- Utility-first approach
- Responsive design with Tailwind breakpoints
- Dark mode support (class-based strategy)

### Component Styling

Components follow a consistent pattern:
- Functional components with TypeScript
- Props destructuring with type definitions
- Tailwind classes for styling
- Lucide React for icons

## Code Conventions

### File Organization

- **Components**: One component per file, PascalCase filenames
- **Services**: Singleton pattern for stateful services
- **Types**: Centralized in `src/types/index.ts`
- **Utilities**: Helper functions in `src/utils/`

### Naming Conventions

- **Components**: PascalCase (e.g., `TreatmentWorkspace.tsx`)
- **Files**: Match component name
- **Variables**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE (when appropriate)

### TypeScript Patterns

- Use explicit type annotations for function parameters
- Define interfaces for component props
- Use type inference for simple cases
- Avoid `any` type - use `unknown` or proper types
- Use enums or string literal unions for fixed sets of values

### React Patterns

- Functional components with hooks
- Custom hooks prefixed with `use` (e.g., `useApp`)
- Context providers at appropriate levels
- Avoid prop drilling - use context for deeply nested props
- Keep components focused and single-purpose

## Error Handling

### Error Handler Service (src/services/errorHandler.ts)

Centralized error handling for consistent error management across the application.

### Webhook Error Handling

- Try-catch blocks around fetch operations
- Console logging with emoji indicators (🚀, ✅, ❌, 📤, etc.)
- Return boolean success/failure indicators
- Graceful degradation on network failures

## Important Notes for AI Assistants

### Language Considerations

- **UI Text**: French language for all user-facing text
- **Code Comments**: Mix of French and English (prefer French for domain-specific comments)
- **Variable Names**: Often use French terms (e.g., `détourage`, `traitement`, `produit`)
- When adding new features, maintain French language consistency

### Webhook Integration

- The webhook URL is hardcoded but should be treated as configuration
- Base64 encoding must be PURE (no data URI prefix)
- Multi-image support is critical - always handle arrays
- Console logging is extensive for debugging - maintain this pattern

### State Management

- Always use dispatch actions, never mutate state directly
- State updates are synchronous within reducer
- Side effects (localStorage, webhooks) handled in useEffect or components
- Context must be accessed within provider boundaries

### File Upload Handling

- Uses react-dropzone for drag-and-drop
- Generates preview URLs with URL.createObjectURL
- Cleanup preview URLs to prevent memory leaks
- Support both single and multiple file uploads

### TypeScript Best Practices

- Enable strict mode (already configured)
- Use type imports: `import type { ... }`
- Define return types for exported functions
- Use discriminated unions for state variants

### Testing Considerations

- No test framework currently configured
- Consider adding Vitest for unit tests
- Consider adding React Testing Library for component tests
- Maintain testable component structure (pure functions, clear props)

### Performance Considerations

- Lazy load components if needed (React.lazy)
- Memoize expensive computations (useMemo)
- Avoid unnecessary re-renders (React.memo, useCallback)
- Optimize images before upload when possible
- Consider virtual scrolling for large lists

### Security Considerations

- No authentication currently implemented
- AdminLogin component exists but functionality unclear
- Webhook URL is public in code - should be environment variable
- File upload validation needed (file types, sizes)
- XSS prevention through React's automatic escaping
- Consider CSP headers for production

## Common Tasks

### Adding a New Treatment Type

1. Add treatment definition to `initialState.treatments` in AppContext.tsx
2. Define treatment options interface in types/index.ts
3. Create treatment-specific form component if needed
4. Update webhook payload to include new treatment parameters
5. Update n8n workflow to handle new treatment type

### Adding a New Component

1. Create component file in `src/components/` or `src/components/ui/`
2. Define Props interface with TypeScript
3. Use functional component with proper typing
4. Import and use in parent component
5. Follow existing patterns for styling and state management

### Modifying Webhook Payload

1. Update WebhookPayload interface in types/index.ts
2. Modify webhookService.sendTreatmentRequest method
3. Update all call sites to provide new required fields
4. Test with n8n webhook endpoint
5. Update this documentation

### Adding Environment Variables

1. Create `.env` file (already in .gitignore)
2. Prefix variables with `VITE_` for client-side access
3. Access via `import.meta.env.VITE_VARIABLE_NAME`
4. Update vite-env.d.ts for type safety
5. Document required variables

## Git Workflow

- **Main Branch**: Default development branch
- **Feature Branches**: Use descriptive names prefixed with `claude/`
- **Commit Messages**: Clear, descriptive messages in English or French
- **Push Strategy**: Push to feature branches, create PRs for main

### Recent Commits

The recent commit history shows updates to:
- webhookService.ts (webhook integration improvements)
- VideoGenerationPage.tsx (video generation features)
- VideoGenerationForm.tsx (form improvements)
- App.tsx (application structure updates)

## Deployment

- Build output: `dist/` directory
- Static site deployment (Vercel, Netlify, etc.)
- Ensure environment variables configured in deployment platform
- Configure CORS for webhook endpoint if needed

## Future Improvements

Consider these enhancements:
1. Environment variable configuration for webhook URL
2. User authentication and session management
3. Result caching and history
4. Batch processing support
5. Progress tracking for long-running jobs
6. Error recovery and retry mechanisms
7. Image preview and comparison tools
8. Export functionality for processed images
9. Analytics and usage tracking
10. Comprehensive test coverage

## Resources

- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org
- **Lucide Icons**: https://lucide.dev

## Support

For issues or questions about this codebase:
1. Review this documentation
2. Check type definitions in `src/types/index.ts`
3. Examine existing component patterns
4. Test changes in development mode before committing
5. Maintain consistency with existing code style

---

**Last Updated**: 2025-11-17
**Version**: 0.0.0
**Maintained by**: AI Assistant Claude
