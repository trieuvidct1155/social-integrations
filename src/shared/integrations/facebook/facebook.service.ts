import axios from 'axios';
import fs from 'fs';

import { config } from 'dotenv';
config();

export class FacebookIntegrationService {
  private accessToken: string;
  private pageId: string;

  constructor(accessToken: string, pageId: string) {
    this.accessToken = accessToken;
    this.pageId = pageId;
  }

  public async publicContent<T>(meta: T): Promise<any> {
    try {
      const { type, photos, ...data } = meta as any;
      const url = `https://graph.facebook.com/${this.pageId}/${type}?access_token=${this.accessToken}`;

      // Set the headers
      const headers = {
        'Content-Type': 'multipart/form-data',
      };

      const formData = new FormData();
      formData.append('published', 'true');
      formData.append('message', data.message);

      for (let i = 0; i < photos.length; i++) {
        const photo: any = photos[i];
        formData.append(
          `attached_media[${i}]`,
          JSON.stringify({
            media_fbid: '0',
            caption: photo?.name || 'test',
            target: this.pageId,
          }),
        );

        // Read the file as a buffer
        const fileBuffer = fs.readFileSync(photo.src);

        // Create a Blob object from the buffer
        const fileBlob = new Blob([fileBuffer], {
          type: photo.mimetype,
        });

        photo?.src ? formData.append(`file${i}`, fileBlob, photo?.name) : null;
      }

      const result = await axios.post(url, formData, { headers });

      return {
        error: false,
        data: result.data,
      };
    } catch (error) {
      console.log('error', error);
      return {
        error: true,
        data: null,
      };
    }
  }
}
