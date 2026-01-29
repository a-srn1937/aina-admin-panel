# ALTCHA Captcha Setup Guide

## Overview
ALTCHA is a privacy-first CAPTCHA alternative that has been integrated into the sign-in page to prevent bot submissions.

## Configuration

### 1. Get Your API Key
1. Visit [ALTCHA.org](https://altcha.org/)
2. Sign up for a free account
3. Create a new project
4. Copy your API key (starts with `ckey_`)

### 2. Update the Challenge URL
Open `src/auth/view/jwt/jwt-sign-in-view.jsx` and replace the placeholder API key:

```jsx
challengeurl="https://eu.altcha.org/api/v1/challenge?apiKey=ckey_your_api_key_here"
```

Replace `ckey_your_api_key_here` with your actual API key.

### Alternative: Self-Hosted Challenge Server
If you prefer to host your own challenge server:

1. Follow the [ALTCHA Server Integration Guide](https://altcha.org/docs/v2/server-integration/)
2. Update the `challengeurl` to point to your server endpoint
3. Example: `challengeurl="https://your-api.example.com/altcha/challenge"`

## Features Implemented

### ✅ Form Validation
- ALTCHA verification is required before form submission
- Integrated with Zod schema validation
- Persian error messages

### ✅ React Integration
- Uses `useRef` to access the widget instance
- Listens to `statechange` events
- Updates form value when verification completes
- Proper cleanup on component unmount

### ✅ Theme Integration
- CSS variables match MUI theme colors
- Responsive design (100% width)
- Consistent border radius (8px)
- Uses theme colors:
  - Primary color for focus state
  - Error color for error messages
  - Grey colors for borders and backgrounds

### ✅ Persian Localization
Custom translations for all widget states:
- **Label**: "من ربات نیستم" (I'm not a robot)
- **Verifying**: "در حال تایید..." (Verifying...)
- **Verified**: "تایید شد" (Verified)
- **Error**: "خطا در تایید. دوباره تلاش کنید." (Error in verification. Try again.)
- **Expired**: "منقضی شده. دوباره تلاش کنید." (Expired. Try again.)

### ✅ UX Enhancements
- Submit button disabled until captcha is verified
- Hidden footer for cleaner appearance
- Seamless integration with existing form flow

## Testing

### Development Mode
For testing purposes, you can use ALTCHA's test mode:

```jsx
<altcha-widget
  test
  challengeurl="https://eu.altcha.org/api/v1/challenge?apiKey=ckey_test"
/>
```

This will always verify successfully without requiring actual proof-of-work.

## Troubleshooting

### Widget Not Appearing
1. Ensure `altcha` package is installed: `yarn list altcha`
2. Check browser console for errors
3. Verify the import statement: `import 'altcha';`

### Verification Not Working
1. Check that the API key is correct
2. Verify the challenge URL is accessible
3. Check browser console for network errors
4. Ensure CORS is properly configured on your challenge server (if self-hosted)

### Styling Issues
The widget uses CSS variables that inherit from the MUI theme. If styles don't match:
1. Check that theme variables are properly defined
2. Verify the CSS variable names in the `sx` prop
3. Use browser DevTools to inspect the widget's shadow DOM

## Security Notes

- Never commit your API key to version control
- Consider using environment variables for the API key
- ALTCHA is GDPR/HIPAA/CCPA compliant
- No user tracking or cookies
- Privacy-first design

## Resources

- [ALTCHA Documentation](https://altcha.org/docs/)
- [Widget Integration Guide](https://altcha.org/docs/v2/widget-integration/)
- [Widget Customization](https://altcha.org/docs/v2/widget-customization/)
- [Server Integration](https://altcha.org/docs/v2/server-integration/)
