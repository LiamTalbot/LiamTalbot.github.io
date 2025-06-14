# Copilot Instructions

- The github repo is LiamTalbot/LiamTalbot.github.io and the primary branch is main.
- This is a hobby project to experiment with redering a versatile dynamic timeline using a simple technology stack.
- It is a single page application.
- All processing is done on the browser; there is no server-side rendering or processing.
- The only languages used are HTML, vanilla Javascript, and CSS.
- As few libraries and frameworks as is practical should be used.
- All langauges, libraries, and frameworks should be the latest versions supported by common browsers.
- The solution should use standard naming such that names of entities are consistent across the entire solution.

## Project Structure

- index.html is the entry point and only page of the application.
- index.css contains the top-level, non-component styling for the application.
- index.js is the main entry point and contains the main logic of the application.
- Javascript Alpine ViewModels are contained, each in their own files, in the "ViewModels" folder.
- Files in the "Data" directory push objects onto the dataset. These objects exist to simulate data coming from a server.

## Libraries and Frameworks

- Tailwind CSS provides the look-and-feel of the application.
- Alpine.js enables the application.
- D3.js rendera the timeline.
- Other libraries and frameworks are to be used if they solve a problem or set of problems not easily solved without them, and only if they're well maintained and commonly used.

## CSS Best Practices

The following CSS Best Practices should be obeyed if they make sense with the libraries and frameworks used.

### General Styling

- Always wrap card content in a .card-body element for consistent padding
- Use semantic class names that describe the component's purpose (e.g., `report-metadata`, `history-item`)
- Define common padding/margin values as CSS variables in app.css
- Avoid direct element styling, prefer class-based selectors
- Use animation keyframes for transitions (fadeIn, slideIn, pulse)
- Style from the component's root element down to maintain CSS specificity

### Theme Support

- Use CSS variables defined in index.css for colors, never hard-coded RGB or HEX values
- Support both light and dark themes via the [data-theme="dark"] selector
- Test all components in both light and dark themes before committing
- Use rgba(var(--primary-color-rgb), opacity) for transparent colors
- Apply color transitions with `transition: color 0.3s ease, background-color 0.3s ease`

### Icons & UI Elements

- Use Tailwind icons with consistent sizing and spacing
- Add icon animations on hover using transform properties
- Format icon containers with proper alignment: `d-flex align-items-center gap-2`
- Include appropriate ARIA attributes on interactive icons

### Card & Component Design

- Apply consistent border-radius using var(--border-radius) variables
- Use var(--card-shadow) for box-shadow on cards and raised elements
- Apply subtle hover effects: transform, box-shadow, or background-color changes
- Create clean card headers with the primary gradient background
- Use primary-gradient for accent elements: `background: var(--primary-gradient)`

### Responsive Design

- Use responsive grids with Tailwind's system or CSS Grid
- Implement dedicated media queries for mobile adjustments at standard breakpoints
- Test on multiple viewport sizes: desktop, tablet, and mobile
- Avoid fixed pixel values for responsive elements, prefer rem/em units
- Adapt to smaller screens by adjusting spacing, font size, and layout

### Best Practices

- Use rem/em units for font sizes and spacing for better accessibility
- Document any magic numbers or non-obvious style choices in comments
- Maintain semantic HTML structure with proper heading hierarchy
- Include responsive adjustments at the bottom of CSS files
- Group related CSS rules together with clear comments

## Code Style

The following Code Styles should be obeyed if they make sense with the libraries and frameworks used.

- Prefer async/await over direct Task handling for asynchronous operations
- Use nullable reference types
- Use var over explicit type declarations 
- Use consistent naming conventions
- Use meaningful names for variables, methods, and classes
- Use dependency injection for services and components

## Component Structure

- Keep components small and focused
- Extract reusable logic into services
- Use cascading parameters sparingly
- Prefer component parameters over cascading values

## Error Handling

- Use try-catch blocks in event handlers
- Implement proper error boundaries
- Display user-friendly error messages
- Log errors to the console

## Performance

- Implement proper component lifecycle methods
- Avoid unnecessary renders

## Testing
- No testing

## Documentation
- No documentation

## Security
- Always validate user input

## Accessibility
- Use semantic HTML
- Include ARIA attributes where necessary
- Ensure keyboard navigation works

## File Organization
- All files are at the top level of the repo