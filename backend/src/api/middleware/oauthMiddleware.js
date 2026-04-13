import { logger } from '../../utils/logger.js';

// Google OAuth configuration
export const googleOAuthConfig = {
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
  redirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL || 'http://localhost:5000/auth/google/callback',
};

export const validateGoogleOAuthConfig = () => {
  if (!googleOAuthConfig.clientId || !googleOAuthConfig.clientSecret) {
    logger.warn('Google OAuth not fully configured', {
      hasClientId: !!googleOAuthConfig.clientId,
      hasClientSecret: !!googleOAuthConfig.clientSecret,
    });
    return false;
  }
  return true;
};

export function getGoogleAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: googleOAuthConfig.clientId,
    redirect_uri: googleOAuthConfig.redirectUrl,
    response_type: 'code',
    scope: 'openid profile email',
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
