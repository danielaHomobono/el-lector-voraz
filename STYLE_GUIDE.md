# El Lector Voraz - Style Guide

## Color Palette

The application uses a neutral, earthy color palette that evokes a warm, inviting bookstore and café atmosphere:

| Variable | Color Code | Usage |
|----------|------------|-------|
| `--primary` | #626d71 | Main brand color, headers, navigation |
| `--primary-dark` | #4e585b | Darker shade for hover states, gradients |
| `--secondary` | #b38867 | Accent buttons, highlights, prices |
| `--accent` | #ddbc95 | Subtle accents, secondary buttons |
| `--text` | #626d71 | Main text color |
| `--text-light` | #b38867 | Secondary text, labels |
| `--background` | #f5f5f0 | Page background |
| `--card-bg` | #ffffff | Card backgrounds |
| `--success` | #4D7A53 | Success messages, in-stock indicators |
| `--error` | #C43B3B | Error messages, delete buttons |
| `--warning` | #ddbc95 | Warning messages, low-stock indicators |
| `--highlight` | #cdcdc0 | Subtle highlights, hover states |

## Gradients

The application uses consistent gradients for visual elements:

| Variable | Definition | Usage |
|----------|------------|-------|
| `--primary-gradient` | linear-gradient(to right, var(--primary), var(--primary-dark)) | Header background |
| `--accent-gradient` | linear-gradient(to right, var(--primary), var(--secondary), var(--accent)) | Decorative elements, borders |

## Typography

- **Headings**: 'Libre Baskerville', serif
- **Body Text**: 'Source Sans Pro', sans-serif

## Components

### Buttons

- Primary buttons: `--secondary` background with white text
- Secondary buttons: `--accent` background with `--primary` text
- Danger buttons: `--error` background with white text
- All buttons use `--border-radius` (8px)

### Cards

- Background: `--card-bg`
- Border radius: `--border-radius` (8px)
- Box shadow: `--shadow`
- Hover effect: slight elevation and shadow increase

### Forms

- Input fields: white background, light border
- Focus state: border color changes to `--secondary`
- Labels: `--text` color, 500 font weight

## Usage Guidelines

1. **Always use CSS variables** instead of hardcoded color values
2. **Maintain consistent spacing** using rem units (base 16px)
3. **Follow accessibility guidelines** with proper contrast ratios
4. **Use the defined gradients** for decorative elements
5. **Maintain consistent border-radius** across components

## File Structure

- `variables.css`: Central definition of all color variables and common styles
- `styles.css`: Main stylesheet with global styles
- `common.css`: Shared components across pages
- Individual page stylesheets (e.g., `cafe.css`, `inventory.css`): Page-specific styles

Always import stylesheets in this order:
1. `variables.css`
2. `styles.css`
3. `common.css`
4. Page-specific CSS