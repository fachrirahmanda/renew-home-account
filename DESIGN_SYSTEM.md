# Design System Integration Guide

## Overview
`renew-home-account` uses the **Basis design-system** from Cloudflare Pages, the same design system used by **silpasala** (project-tracker).

**Production URL:** `https://design-system-bc6.pages.dev/v1`

## Files Loaded

The design system is loaded via CDN in `index.html`:

```html
<!-- Basis design system CSS: all component styles -->
<link rel="stylesheet" href="https://design-system-bc6.pages.dev/v1/ds.css" />

<!-- Basis design system JS: interactive behaviors and theme management -->
<script type="module" src="https://design-system-bc6.pages.dev/v1/ds.js"></script>
```

**Sizes (gzipped):**
- `ds.css` — 9.86 KiB (47.34 KiB uncompressed)
- `ds.js` — 2.22 KiB (5.61 KiB uncompressed)

## Available Components

### Buttons

```html
<!-- Primary button -->
<button class="btn btn-primary">Save</button>

<!-- Ghost button (transparent background) -->
<button class="btn btn-ghost">Cancel</button>

<!-- Outline button -->
<button class="btn btn-outline">Delete</button>

<!-- Danger button -->
<button class="btn btn-danger">Remove</button>

<!-- Danger soft (subdued danger) -->
<button class="btn btn-danger-soft">Archive</button>

<!-- Success button -->
<button class="btn btn-success">Confirm</button>

<!-- Sizes -->
<button class="btn btn-sm">Small</button>
<button class="btn btn-lg">Large</button>

<!-- Block width -->
<button class="btn btn-block">Full Width</button>

<!-- Loading state -->
<button class="btn" aria-busy="true">Loading...</button>

<!-- Disabled -->
<button class="btn" disabled>Disabled</button>
```

### Forms

```html
<!-- Field container (flex column, gap management) -->
<div class="field">
  <!-- Label -->
  <label class="field-label">
    Email
    <output>Optional</output>
  </label>
  
  <!-- Input -->
  <input type="email" class="input" placeholder="your@email.com" />
  
  <!-- Hint text -->
  <div class="hint">We'll never share your email</div>
  
  <!-- Error message (shown on invalid) -->
  <p class="field-error">Invalid email format</p>
</div>

<!-- Text input -->
<input type="text" class="input" />

<!-- Text input (invalid state) -->
<input type="email" class="input" aria-invalid="true" />

<!-- Textarea -->
<textarea class="input"></textarea>

<!-- Select dropdown -->
<select class="input">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Sizes -->
<input class="input input-sm" />
<input class="input input-lg" />

<!-- Disabled -->
<input class="input" disabled />
```

### Typography

```html
<!-- Headings inherit from design-system -->
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>

<!-- Paragraphs use design-system colors -->
<p>Normal text</p>

<!-- Muted text -->
<p style="color: var(--muted)">Muted text</p>
```

### Theme Switching

Use the `DS` API exported by the design-system:

```typescript
// Get current theme ('light', 'dark', or 'system')
const theme = DS.getTheme();

// Set theme and persist to localStorage
DS.setTheme('light');  // Light mode
DS.setTheme('dark');   // Dark mode
DS.setTheme('system'); // Follow OS preference

// Listen for theme changes
document.addEventListener('ds:themechange', (e) => {
  console.log('Theme changed to:', e.detail.theme);
});
```

### Toast Notifications

```typescript
// Simple info toast
DS.toast('Message saved successfully');

// With variant
DS.toast('Email sent!', { variant: 'success' });
DS.toast('Warning!', { variant: 'warning' });
DS.toast('Error occurred!', { variant: 'danger' });

// Custom duration (0 = never auto-dismiss)
DS.toast('Copying...', { duration: 0 });

// With action button
DS.toast('Undo?', {
  variant: 'success',
  action: {
    label: 'Undo',
    onClick: () => { /* undo logic */ }
  }
});

// Dismiss programmatically
const { dismiss } = DS.toast('Processing...');
setTimeout(dismiss, 5000);
```

### Dialog/Modal

```typescript
// Open dialog
DS.openDialog('#my-dialog');

// Close dialog
DS.closeDialog('#my-dialog');

// Close with return value
DS.closeDialog('#my-dialog', 'confirmed');
```

```html
<!-- Dialog element -->
<dialog id="my-dialog">
  <h2>Confirm Action</h2>
  <p>Are you sure?</p>
  <div style="display: flex; gap: 8px;">
    <button class="btn btn-primary" data-ds-close="confirmed">Confirm</button>
    <button class="btn btn-ghost" data-ds-close>Cancel</button>
  </div>
</dialog>

<!-- Button to open -->
<button class="btn" data-ds-open="#my-dialog">Open</button>
```

### Tabs

```html
<div data-ds-tabs>
  <!-- Tab list -->
  <div role="tablist">
    <button role="tab" aria-controls="tab1" aria-selected="true">Tab 1</button>
    <button role="tab" aria-controls="tab2">Tab 2</button>
    <button role="tab" aria-controls="tab3">Tab 3</button>
  </div>
  
  <!-- Tab panels -->
  <div id="tab1" role="tabpanel">Content 1</div>
  <div id="tab2" role="tabpanel" hidden>Content 2</div>
  <div id="tab3" role="tabpanel" hidden>Content 3</div>
</div>
```

```typescript
// Select tab programmatically
const tab = document.querySelector('[role="tab"]');
DS.selectTab(tab);

// Listen for tab changes
document.addEventListener('ds:tabchange', (e) => {
  console.log('Selected tab:', e.detail.tab);
});
```

## Design Tokens (CSS Variables)

The design-system exports CSS variables for theming:

```css
/* Colors */
--text              /* Foreground text color */
--muted             /* Secondary/muted text */
--fill              /* Background for interactive elements */
--fill-strong       /* Stronger background */
--accent            /* Primary accent color */
--accent-hover      /* Accent color on hover */
--on-accent         /* Text color on accent background */
--surface           /* Main background */
--separator         /* Border/divider color */
--success           /* Success state color */
--success-soft      /* Soft success background */
--danger            /* Error/danger color */
--danger-soft       /* Soft danger background */
--warning           /* Warning color */
--focus             /* Focus ring color */

/* Spacing */
--space-2           /* Small spacing */
--space-3           /* Medium spacing */
--space-4           /* Large spacing */

/* Typography */
--text-sm           /* Small text size */
--text-md           /* Medium text size */

/* Borders */
--radius            /* Border radius */
--radius-sm         /* Small border radius */
--radius-md         /* Medium border radius */
--radius-full       /* Full/pill border radius */
```

**Example usage in app CSS:**

```css
.myComponent {
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--separator);
  padding: var(--space-3);
  border-radius: var(--radius);
}

.myComponent:hover {
  background: var(--fill);
}

.myComponentError {
  color: var(--danger);
  background: var(--danger-soft);
}
```

## How It Works in Renew-Home-Account

### Pages Updated

1. **Login Page** (`src/app/pages/Login.tsx`)
   - Uses `.btn btn-primary` for login button
   - Uses `.field`, `.field-label`, `.input` for form
   - Uses `.field-error` for error messages

2. **Emails Page** (`src/app/pages/Emails.tsx`)
   - Uses `.btn btn-ghost` for settings
   - Uses `.btn btn-danger-soft` for logout
   - Uses `.btn btn-outline btn-sm` for pagination

3. **Settings Page** (`src/app/pages/Settings.tsx`)
   - Uses `.btn btn-ghost` for back button
   - Uses `.field`, `.input` for gmail connection form
   - Uses `.hint` for helper text
   - Uses `.field-error` for validation errors

### CSS Simplification

Before integrating design-system:
- App CSS: 53+ KiB (button, input, form styles duplicated)
- Time to paint: slower due to local CSS parsing

After integrating design-system:
- App CSS: 3.9 KiB (only layout, no component styling)
- Design-system CSS: 9.86 KiB (loaded once, cached globally)
- Time to paint: faster, consistent across all Basis apps

## Development

### Adding New Components

When you need a new UI component:

1. **Check design-system first** - Most common components are already available
2. **Use available classes** - Compose from `.btn`, `.field`, `.input`, etc.
3. **Override with layout CSS** - Only add CSS for positioning, gaps, flex layouts
4. **Use CSS variables** - Reference design-system tokens: `var(--accent)`, `var(--muted)`, etc.

### Example: Creating a Card

```tsx
// In component
<div className={styles.card}>
  <h3>Card Title</h3>
  <p>Card content</p>
  <button className="btn btn-primary">Action</button>
</div>

// In module.css
.card {
  border: 1px solid var(--separator);
  border-radius: var(--radius);
  padding: var(--space-4);
  background: var(--surface);
}

.card:hover {
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.08);
}
```

## Accessibility

The design-system includes accessibility features:

- **Keyboard navigation** - All interactive elements support keyboard
- **ARIA attributes** - Proper roles, states, properties
- **Color contrast** - All color combinations meet WCAG 4.5:1 minimum
- **Focus management** - Visible focus indicators
- **Semantic HTML** - Proper `<button>`, `<dialog>`, `<input>` elements

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

## Further Reading

- **Design-system repo** - `C:\Users\Aleph-2026\Documents\project\design-system`
- **Reference implementation** - silpasala (`C:\Users\Aleph-2026\Documents\project\project-tracker`)
- **Basis design-system docs** - https://design-system-bc6.pages.dev
