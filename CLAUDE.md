# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is an Angular monorepo workspace containing three projects:

- **surya-app**: Main Ionic Angular application (mobile app)
- **surya-admin**: Admin Angular application 
- **surya-lib**: Shared Angular library containing authentication, components, and services

The workspace uses Angular 18.2 with Ionic 8.6 for mobile development and integrates with AWS Cognito for authentication.

## Essential Commands

### Development
- `npm start` or `ng serve` - Start the main surya-app development server
- `ng serve surya-admin` - Start the admin application
- `ng build surya-lib` - Build the shared library (required before building apps)

### Building
- `ng build` - Build the main surya-app application
- `ng build surya-admin` - Build the admin application
- `ng build surya-lib` - Build the shared library

### Testing
- `ng test` - Run tests for the main surya-app
- `ng test surya-admin` - Run tests for admin application
- `ng test surya-lib` - Run tests for the shared library

### Project-specific commands
- `ng generate component component-name --project=surya-app` - Generate components in specific projects
- `ng build --project=surya-lib` - Build specific project

## Architecture Overview

### Monorepo Structure
The workspace follows Angular's monorepo pattern with a shared library approach:

1. **surya-lib** contains shared functionality:
   - Authentication system with AWS Cognito integration
   - Shared components (spinner, etc.)
   - HTTP interceptors for headers
   - Configuration service for environment management

2. **surya-app** is the main Ionic mobile application:
   - Uses Ionic UI components and routing
   - Integrates surya-lib for authentication and shared services
   - Contains pages for user onboarding, chat, health tracking
   - Uses Angular routing with lazy-loaded modules

3. **surya-admin** is a separate admin interface application

### Key Architectural Patterns

- **Configuration Management**: Environment-specific settings are managed through `SuryaLibConfigService` which is initialized in the app module
- **Authentication**: AWS Cognito integration handled by shared library services and interceptors
- **Module Structure**: Each page/feature uses its own Angular module for lazy loading
- **Shared Assets**: The surya-lib assets are automatically included in app builds via angular.json configuration

### Dependencies and Integration

- **Ionic Integration**: Apps use `IonicModule.forRoot()` and `IonicRouteStrategy`
- **HTTP Interceptors**: `HeaderInterceptor` from surya-lib is configured globally
- **Library Dependencies**: surya-lib must be built before building applications that depend on it
- **Styling**: Shared theme from `surya-lib/src/styles/surya-theme.scss` is included in app builds

## Development Workflow

1. Always build surya-lib first when making changes to shared code: `ng build surya-lib`
2. The library uses relative imports in the main app module (temporary during development)
3. Environment configuration is set during app module initialization via `SuryaLibConfigService`
4. Use Angular CLI with `--project` flag to target specific projects in the workspace