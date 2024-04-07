import { ABSPublicContentSocial } from 'src/shared/abstracts/social-publishing.abs';
import { URL_ACCESS_TOKEN_FB } from './facebook.constant';
import axios from 'axios';
import querystring from 'querystring';

type Photo = {
  src: string;
  name: string;
};

export class GraphFBPhoto {
  private message: string = '';
  private photos: Photo[] = [];
  private readonly type: string = 'photos';

  public setMessage(message: string): void {
    this.message = message;
  }

  public setPhotos(photos: Photo[]): void {
    this.photos = photos;
  }

  public get payload(): { message: string; photos: Photo[]; type: string } {
    return {
      message: this.message,
      photos: this.photos,
      type: this.type,
    };
  }
}

export class FacebookIntegration extends ABSPublicContentSocial {
  protected publicContent<T>(meta: T): Promise<any> {
    console.log(meta);
    throw new Error('Method not implemented.');
  }

  public async getAuthorization(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async getAccessToken(): Promise<any> {
    const clientId: string = process.env.APP_ID || '';

    const accessTokenUrl = this.buildAccessTokenUrl(clientId);

    try {
      const result = await axios.get(accessTokenUrl);
      const { access_token } = result.data;

      return {
        error: false,
        data: {
          access_token: access_token,
          page_name: process.env.FACEBOOK_PAGE_ID || '',
        },
      };
    } catch (error) {
      return { error: true, data: null };
    }
  }

  private buildAccessTokenUrl(clientId: string): string {
    const stringified = querystring.stringify({
      grant_type: process.env.GRANT_TYPE || '',
      client_id: clientId,
      client_secret: process.env.APP_SECRET || '',
      fb_exchange_token: process.env.SHORT_LIVED_USER_ACCESS_TOKEN || '',
    });
    return `${URL_ACCESS_TOKEN_FB}?${stringified}`;
  }
}
