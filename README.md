# Surya Health Assistant - Angular Workspace

An AI-powered health assistant platform built as an Angular monorepo workspace with Ionic 8, featuring a mobile app, admin panel, and shared component library with AWS Cognito authentication.

## 🚀 Features

### Surya App (Mobile Application)
- **AI Health Conversations**: Chat interface for health-related queries
- **Personalized Health Plans**: Custom health and wellness plans
- **Meal Tracking**: Log and track meals with nutritional insights
- **Tongue Analysis**: Visual health assessment through tongue capture
- **Subscription Management**: In-app plan selection and management
- **Secure Authentication**: AWS Cognito with admin/user role separation

### Surya Admin (Administrative Panel)
- **User Management**: Create, manage, and monitor user accounts
- **Plan Administration**: Manage health plans and user subscriptions
- **Access Control**: Admin-only access with role-based permissions
- **Password Management**: Reset and manage user credentials
- **Analytics Dashboard**: Monitor user engagement and plan usage

### Surya Lib (Shared Library)
- **Authentication Module**: Reusable AWS Cognito integration
- **Shared Components**: Spinners, headers, plan selection UI
- **Common Services**: Configuration, API clients, utilities
- **Theme System**: Consistent styling across applications

## 📋 Tech Stack

- **Framework**: Angular 18
- **Mobile Framework**: Ionic 8
- **Mobile Runtime**: Capacitor 7
- **Authentication**: AWS Cognito
- **Backend**: AWS API Gateway
- **Language**: TypeScript 5.5
- **Testing**: Karma + Jasmine
- **Markdown**: Marked library for content rendering

## 🛠️ Prerequisites

Before you begin, ensure you have installed:

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## ⚙️ Environment Setup

### For Surya App

1. **Copy the example environment file:**
   ```bash
   cp projects/surya-app/src/environments/environment.example.ts projects/surya-app/src/environments/environment.ts
   cp projects/surya-app/src/environments/environment.example.ts projects/surya-app/src/environments/environment.prod.ts
   ```

2. **Configure your AWS Cognito credentials:**
   ```typescript
   export const environment = {
     production: false,
     apiHost: "https://your-api-host.com/",
     version: "0.2",
     cognito: {
       userPoolId: 'your-region_YourPoolId',
       userPoolWebClientId: 'your-client-id-here',
       region: 'your-region',
       domain: 'your-cognito-domain.auth.your-region.amazoncognito.com',
       clientId: 'your-client-id-here'
     }
   };
   ```

### For Surya Admin

Repeat the same process for admin environment files:
```bash
cp projects/surya-admin/src/environments/environment.example.ts projects/surya-admin/src/environments/environment.ts
cp projects/surya-admin/src/environments/environment.example.ts projects/surya-admin/src/environments/environment.prod.ts
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd surya-workspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the shared library** (required before running apps)
   ```bash
   ng build surya-lib
   ```

4. **Set up environment files** (see Environment Setup above)

## 💻 Development

### Build the Shared Library First
**Important**: Always build the shared library before working with the applications:
```bash
ng build surya-lib
```

### Run Surya App (Mobile)
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/`

### Run Surya Admin
```bash
ng serve surya-admin
```
Navigate to `http://localhost:4200/`

### Development Workflow
When making changes to the shared library:
1. Make your changes in `projects/surya-lib/`
2. Rebuild the library: `ng build surya-lib`
3. The apps will automatically pick up the changes

### Run on Mobile Device
```bash
# iOS
ionic capacitor run ios --project=surya-app

# Android
ionic capacitor run android --project=surya-app
```

## 🏗️ Build

### Build All Projects
```bash
# Build shared library
ng build surya-lib

# Build main app
ng build

# Build admin app
ng build surya-admin
```

### Production Builds
```bash
ng build --configuration production
ng build surya-admin --configuration production
```

Build artifacts will be stored in the `dist/` directory.

## 🧪 Testing

### Run Tests for Specific Project
```bash
# Surya App tests
ng test

# Surya Admin tests
ng test surya-admin

# Surya Lib tests
ng test surya-lib
```

### Run All Tests
```bash
npm test
```

## 🏛️ Architecture Overview

### Monorepo Structure
```
surya-workspace/
├── projects/
│   ├── surya-app/          # Main mobile application
│   ├── surya-admin/        # Admin web application
│   └── surya-lib/          # Shared library
├── angular.json            # Workspace configuration
└── package.json           # Workspace dependencies
```

### Shared Library Architecture

**surya-lib** provides reusable functionality:

- **Authentication Module** (`src/auth/`)
  - Login/logout pages
  - New password flow
  - Auth guards (user & admin)
  - Auth service with Cognito integration
  - Header interceptor for API requests

- **Shared Components** (`src/components/`)
  - Spinner (loading indicator)
  - Header component
  - Plans component (subscription UI)

- **Services** (`src/services/`)
  - Configuration service
  - Plan service
  - Environment service

- **Theming** (`src/styles/`)
  - `surya-theme.scss` - Shared theme styles

### Authentication Flow

- AWS Cognito authentication with session management
- Role-based access control (Admin vs. User)
- `AuthGuard` protects user routes
- `AdminAuthGuard` protects admin-only routes
- Tokens stored in localStorage (`idToken`)
- Automatic token validation and expiration handling

### Configuration Management

Apps initialize the shared library configuration in their app module:
```typescript
SuryaLibConfigService.configure(environment);
```

This centralizes environment-specific settings in the shared library.

### Key Features by Project

#### Surya App
- Onboarding flow for new users
- AI conversation interface
- Health plan management
- Personal data collection
- Meal and tongue capture
- Subscription/payment integration

#### Surya Admin
- User CRUD operations
- Force password changes
- Grant/revoke app access
- View user plans and usage
- Admin-only dashboard

#### Surya Lib
- Reusable auth components
- Common UI elements
- Shared business logic
- Consistent theming

## 📁 Detailed Project Structure

### Surya App (`projects/surya-app/`)
```
src/
├── app/
│   ├── components/        # App-specific components
│   │   ├── meal/         # Meal tracking component
│   │   └── tabs/         # Tab navigation
│   ├── interfaces/       # TypeScript interfaces
│   │   ├── ama.ts       # AMA (Ask Me Anything) types
│   │   ├── chat.ts      # Chat message types
│   │   └── meal.ts      # Meal data types
│   ├── pages/           # Application pages
│   │   ├── conversation/ # Chat interface
│   │   ├── home/        # Dashboard
│   │   ├── plans/       # Subscription plans
│   │   └── start/       # Onboarding
│   └── services/        # App services
│       ├── chat.service.ts
│       ├── user.service.ts
│       └── version.service.ts
└── environments/        # Environment configs
```

### Surya Admin (`projects/surya-admin/`)
```
src/
├── app/
│   ├── pages/
│   │   ├── users/           # User management
│   │   │   └── create-user-modal/
│   │   ├── plan-users/      # Plan subscriptions
│   │   ├── access-denied/   # 403 page
│   │   └── view-complete-plan/
│   └── services/
│       └── users.service.ts
└── environments/
```

### Surya Lib (`projects/surya-lib/`)
```
src/
├── auth/                    # Authentication module
│   ├── guards/
│   ├── interceptors/
│   ├── pages/
│   └── services/
├── components/              # Shared components
├── pages/                   # Shared pages
├── services/                # Shared services
└── styles/                  # Shared styles
    └── surya-theme.scss
```

## 🔒 Security Notes

- Environment files with real credentials are **gitignored**
- Use `environment.example.ts` as a template
- Never commit actual AWS credentials to version control
- Admin routes are protected with role-based guards
- All API requests include authentication headers via interceptor

## 🔑 User Roles

### Admin Users
- Full access to admin panel
- Can create and manage users
- Can reset passwords
- Can view all user data and plans
- Identified by `cognito:groups` containing "admin"

### Regular Users
- Access to mobile app only
- Manage own profile and data
- Subscribe to health plans
- Access AI health features

## 📱 Features in Detail

### Health Conversations
- AI-powered chat interface
- Context-aware responses
- Health-related Q&A
- Personalized recommendations

### Health Plans
- Multiple subscription tiers
- Plan comparison UI
- Token-based usage tracking
- In-app plan selection

### Personal Data
- Onboarding questionnaire
- Health profile setup
- Privacy-compliant data collection

### Tongue Analysis
- Camera integration for tongue capture
- Visual health assessment
- Analysis results display

## 🤝 Contributing

This is a portfolio project. If you'd like to use it as a base for your own project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Fernando Carnaval**
<!-- - Portfolio: [your-portfolio-url] -->
- GitHub: [@fcarnaval](https://github.com/fcarnaval)
- LinkedIn: [Fernando Carnaval](https://www.linkedin.com/in/fernando-carnaval-0a173a28)

## 🙏 Acknowledgments

- Built with [Angular](https://angular.io/)
- UI powered by [Ionic Framework](https://ionicframework.com/)
- Icons by [Ionicons](https://ionic.io/ionicons)
- Authentication by [AWS Cognito](https://aws.amazon.com/cognito/)
- Markdown rendering by [Marked](https://marked.js.org/)

## 📚 Additional Documentation

For detailed development guidelines and architecture information, see [CLAUDE.md](CLAUDE.md).

---

**Note**: This is a portfolio project demonstrating enterprise-grade Angular monorepo architecture with shared libraries, role-based access control, and AWS integration.
