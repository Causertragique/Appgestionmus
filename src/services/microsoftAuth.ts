// Configuration Microsoft OAuth
export const MICROSOFT_CONFIG = {
  clientId: process.env.VITE_MICROSOFT_CLIENT_ID || 'your-microsoft-client-id',
  authority: 'https://login.microsoftonline.com/common',
  redirectUri: `${window.location.origin}/auth/microsoft/callback`,
  scopes: ['openid', 'profile', 'email', 'User.Read']
};

// Interface pour la réponse Microsoft
export interface MicrosoftAuthResponse {
  accessToken: string;
  idToken: string;
  account: {
    homeAccountId: string;
    environment: string;
    tenantId: string;
    username: string;
    localAccountId: string;
  };
}

// Interface pour les informations utilisateur Microsoft
export interface MicrosoftUserInfo {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  userPrincipalName: string;
  mail: string;
  jobTitle?: string;
  officeLocation?: string;
  preferredLanguage?: string;
  mobilePhone?: string;
  businessPhones?: string[];
}

export class MicrosoftAuthService {
  private static instance: MicrosoftAuthService;

  public static getInstance(): MicrosoftAuthService {
    if (!MicrosoftAuthService.instance) {
      MicrosoftAuthService.instance = new MicrosoftAuthService();
    }
    return MicrosoftAuthService.instance;
  }

  /**
   * Initie le processus d'authentification Microsoft
   */
  public async signIn(): Promise<MicrosoftUserInfo | null> {
    try {
      // Dans un environnement de production, vous utiliseriez MSAL
      // Pour cette démonstration, nous simulons le processus
      
      // Ouvrir une popup pour l'authentification Microsoft
      const authUrl = this.buildAuthUrl();
      const popup = window.open(authUrl, 'microsoft-auth', 'width=500,height=600');
      
      // Attendre la réponse de l'authentification
      const result = await this.waitForAuthResult(popup);
      
      if (result) {
        // Récupérer les informations utilisateur
        const userInfo = await this.getUserInfo(result.accessToken);
        return userInfo;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de l\'authentification Microsoft:', error);
      throw error;
    }
  }

  /**
   * Construit l'URL d'authentification Microsoft
   */
  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: MICROSOFT_CONFIG.clientId,
      response_type: 'code',
      redirect_uri: MICROSOFT_CONFIG.redirectUri,
      scope: MICROSOFT_CONFIG.scopes.join(' '),
      response_mode: 'query',
      state: this.generateState(),
      prompt: 'select_account'
    });

    return `${MICROSOFT_CONFIG.authority}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  /**
   * Génère un état aléatoire pour la sécurité
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Attend le résultat de l'authentification
   */
  private async waitForAuthResult(popup: Window | null): Promise<MicrosoftAuthResponse | null> {
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

        if (event.data.type === 'MICROSOFT_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve(event.data.result);
        } else if (event.data.type === 'MICROSOFT_AUTH_ERROR') {
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
   * Récupère les informations utilisateur depuis Microsoft Graph
   */
  private async getUserInfo(accessToken: string): Promise<MicrosoftUserInfo> {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les informations utilisateur');
    }

    return await response.json();
  }

  /**
   * Déconnecte l'utilisateur de Microsoft
   */
  public async signOut(): Promise<void> {
    try {
      // Dans un vrai projet, vous utiliseriez MSAL pour la déconnexion
      console.log('Déconnexion Microsoft effectuée');
    } catch (error) {
      console.error('Erreur lors de la déconnexion Microsoft:', error);
    }
  }
}

export default MicrosoftAuthService.getInstance();