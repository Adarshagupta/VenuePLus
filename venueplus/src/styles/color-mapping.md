# VenuePlus Design System - Color Mapping

## Primary Color Palette

### Brand Colors
- **Primary**: Blue gradient (`--gradient-primary`) - Main CTAs, primary actions
- **Secondary**: Indigo/Purple gradient (`--gradient-secondary`) - Secondary actions
- **Accent**: Purple/Pink gradient (`--gradient-accent`) - Highlights, special features

### Specific Usage

#### Buttons
- `.btn-primary` - Main action buttons (Sign In, Create Trip, etc.)
- `.btn-secondary` - Secondary actions (Cancel, Back, etc.)  
- `.btn-accent` - Special actions (Save, Premium features, etc.)

#### Text
- `.text-heading` - Main headings and titles
- `.text-body` - Regular body text
- `.text-muted` - Secondary information
- `.gradient-text-primary` - Hero headings, brand text
- `.gradient-text-accent` - Special callouts

#### Components
- `.card-elegant` - Standard card containers
- `.surface-elevated` - Important/highlighted cards
- `.badge-primary` - Primary status indicators
- `.badge-success` - Success states
- `.badge-warning` - Warning states
- `.badge-error` - Error states

#### Category Color Mapping

##### Activity Categories
- **Sightseeing**: Blue (`bg-blue-100 text-blue-700`)
- **Adventure**: Red (`bg-red-100 text-red-700`)
- **Culture**: Purple (`bg-purple-100 text-purple-700`)
- **Food**: Orange (`bg-orange-100 text-orange-700`)
- **Nature**: Green (`bg-green-100 text-green-700`)
- **Wellness**: Pink (`bg-pink-100 text-pink-700`)
- **Shopping**: Indigo (`bg-indigo-100 text-indigo-700`)
- **Transport**: Blue (`bg-blue-100 text-blue-700`)
- **Accommodation**: Green (`bg-green-100 text-green-700`)

##### Duration Categories
- **4-6 Days**: Green gradient (Budget)
- **7-9 Days**: Blue gradient (Value)
- **10-12 Days**: Purple gradient (Premium)
- **13-15+ Days**: Orange gradient (Luxury)

## Consistency Rules

1. **Always use CSS variables** instead of hardcoded colors
2. **Gradients for primary actions** and hero elements
3. **Solid colors for badges** and status indicators
4. **Neutral grays for text** hierarchy
5. **Consistent hover states** using predefined variables

## Migration Checklist

- [ ] Replace hardcoded `bg-blue-600` with `btn-primary` class
- [ ] Replace `from-blue-600 to-purple-600` with `gradient-text-primary`
- [ ] Update badge colors to use new category system
- [ ] Ensure all cards use `card-elegant` or `surface-elevated`
- [ ] Apply text classes consistently across components
