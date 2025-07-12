# Changelog

## [0.2.0] - 2023-11-20

### Added
- PWA support with next-pwa configuration
- Generated PWA icons for different sizes
- Service worker for offline support
- Environment variables template for easy setup
- Script to generate PWA icons
- Updated installation scripts

### Fixed
- Removed duplicate Firebase initialization in db.ts
- Fixed circular dependency in auth.tsx
- Updated Firebase configuration to use environment variables
- Fixed image handling in ImageCarousel.tsx to consistently use Next.js Image component
- Removed duplicate auth pages from public directory
- Consolidated routing to use Next.js App Router exclusively
- Removed Pages Router files

### Changed
- Updated documentation (README.md, INSTALLATION.md, FIREBASE_SETUP.md)
- Improved project structure
- Enhanced PWA manifest with shortcuts and proper icons

## [0.1.0] - 2023-11-01

### Added
- Initial release
- Firebase authentication
- Listing upload and display
- Payment integration
- User dashboard
- Trial mode with blurred images for unpaid users 