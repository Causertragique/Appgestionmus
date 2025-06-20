// Configuration Google OAuth
export const GOOGLE_CONFIG = {
  clientId: process.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
  redirectUri: `${window.location.origin}/auth/google/callback`,
  scope: 'openid email profile'
};

// Interface pour la réponse Google
export interface GoogleAuthResponse {
  access_token: string;
  id_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

// Interface pour les informations utilisateur Google
export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  /**
   * Initie le processus d'authentification Google
   */
  public async signIn(): Promise<GoogleUserInfo | null> {
    try {
      // Dans un environnement de production, vous utiliseriez la Google OAuth API
      // Pour cette démonstration, nous simulons le processus
      
      // Ouvrir une popup pour l'authentification Google
      const authUrl = this.buildAuthUrl();
      const popup = window.open(authUrl, 'google-auth', 'width=500,height=600');
      
      // Attendre la réponse de l'authentification
      const result = await this.waitForAuthResult(popup);
      
      if (result) {
        // Récupérer les informations utilisateur
        const userInfo = await this.getUserInfo(result.access_token);
        return userInfo;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de l\'authentification Google:', error);
      throw error;
    }
  }

  /**
   * Construit l'URL d'authentification Google
   */
  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_CONFIG.clientId,
      redirect_uri: GOOGLE_CONFIG.redirectUri,
      response_type: 'code',
      scope: GOOGLE_CONFIG.scope,
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Attend le résultat de l'authentification
   */
  private async waitForAuthResult(popup: Window | null): Promise<GoogleAuthResponse | null> {
    return new Promise((resolve, reject) => {
      if (!popup) {
        reject(new Error('Impossible d\'ouvrir la popup d\'authentification'));
        return;
      }

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          reject(new Error('Authentification annulée par l\'utilisateur'));
        }
      }, 1000);

      // Écouter les messages de la popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve(event.data.result);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageListener);
    });
  }

  /**
   * Récupère les informations utilisateur depuis Google
   */
  private async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les informations utilisateur');
    }

    return await response.json();
  }

  /**
   * Déconnecte l'utilisateur de Google
   */
  public async signOut(): Promise<void> {
    try {
      // Révoquer le token d'accès
      // Dans un vrai projet, vous stockeriez et révoqueriez le token
      console.log('Déconnexion Google effectuée');
    } catch (error) {
      console.error('Erreur lors de la déconnexion Google:', error);
    }
  }
}

export default GoogleAuthService.getInstance();