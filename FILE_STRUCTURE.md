# Tuto Learning Platform - File Structure

This document outlines the organized file structure for the Tuto Learning Platform.

## Root Directory
```
tuto-mine - Copy (2)/
├── index.html                 # Main landing page
├── dashboard.html             # User dashboard
├── create-plan.html          # Study plan creation page
├── learning-interface.html   # Learning interface
├── all-study-plans.html      # All study plans overview
├── README.md                 # Project documentation
├── .gitignore               # Git ignore file
├── FILE_STRUCTURE.md        # This file
├── css/                     # CSS stylesheets
├── js/                      # JavaScript files
└── assets/                  # Media and font assets
```

## CSS Directory (`css/`)
```
css/
└── styles.css               # Main stylesheet with fonts and theme support
```

## JavaScript Directory (`js/`)
```
js/
├── script.js                # Main landing page functionality
├── dashboard.js             # Dashboard functionality
├── create-plan.js           # Study plan creation logic
├── learning-interface.js    # Learning interface functionality
├── all-study-plans.js       # Study plans management
├── api-service.js           # API service layer
├── config.js                # AI configuration
├── env.js                   # Environment variables
└── env.example.js           # Environment variables template
```

## Assets Directory (`assets/`)
```
assets/
├── images/                  # Image files
│   ├── tuntle.png          # Tuto logo (PNG version)
│   └── tuntle.svg          # Tuto logo (SVG version)
└── fonts/                   # Font files
    ├── bespoke-stencil/     # Bespoke Stencil font family
    │   └── BespokeStencil-Bold.woff2
    └── supreme/             # Supreme font family
        └── Supreme-Regular.woff2
```

## Key Features of the Structure

### 1. **Organized Assets**
- All images, fonts, and media files are centralized in the `assets/` directory
- Fonts are organized by family in subdirectories
- Images are separated from other assets for easy management

### 2. **Modular JavaScript**
- All JavaScript files are organized in the `js/` directory
- Clear separation of concerns with dedicated files for each page
- Shared utilities like `api-service.js` and `config.js` are easily accessible

### 3. **Centralized Styling**
- All CSS is contained in the `css/` directory
- Single `styles.css` file manages all styling including fonts and themes

### 4. **Clean HTML Structure**
- HTML files remain in the root for easy access
- All external resources reference the organized directory structure
- Consistent path references using relative paths

### 5. **Font Management**
- Fonts are properly organized by family
- CSS uses correct relative paths to font files
- Font preloading is implemented for performance

## Path References

### CSS References
- Font files: `./assets/fonts/[family]/[filename]`
- Stylesheet: `./css/styles.css`

### JavaScript References
- All JS files: `./js/[filename]`
- Environment and config: `./js/env.js`, `./js/config.js`

### Image References
- Logo images: `./assets/images/tuntle.png` or `./assets/images/tuntle.svg`
- Favicon: `./assets/images/tuntle.png`

## Benefits of This Structure

1. **Maintainability**: Easy to locate and update specific types of files
2. **Scalability**: Simple to add new assets, fonts, or JavaScript modules
3. **Performance**: Organized structure allows for better caching strategies
4. **Collaboration**: Clear separation makes it easier for teams to work on different aspects
5. **Deployment**: Organized structure simplifies deployment and build processes

## Notes

- All paths use relative references (`./`) for portability
- Font preloading is implemented for optimal performance
- The structure maintains backward compatibility while improving organization
- Environment variables are properly separated for security
