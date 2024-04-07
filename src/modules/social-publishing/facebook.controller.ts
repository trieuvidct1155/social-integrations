import {
  Controller,
  Post,
  BadRequestException,
  Body,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { convert } from 'html-to-text';
import {
  FacebookIntegration,
  GraphFBPhoto,
} from 'src/shared/integrations/facebook/facebook.integration';
import { FacebookIntegrationService } from 'src/shared/integrations/facebook/facebook.service';

@Controller('publish/facebook')
@ApiTags('Tickets')
export class PublishFacbookController {
  constructor(private readonly fbIntegration: FacebookIntegration) {}

  @Post('share/:id/:lang')
  async shareFacebook(
    @Param('id') id: string,
    @Param('lang') lang: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      let { name, sourceLink, sourceName } = body;

      sourceLink = sourceLink ? sourceLink : process.env.SOURCE;
      sourceName = sourceName ? sourceName : process.env.SOURCE;
      name = name.toUpperCase();

      const data = {
        postId: '7981e49d-5075-402b-b8bc-23633b9d8807',
        content: 'test',
        thumbnail: {
          src: './test.png',
          name: 'test',
        },
      };
      const contentPost = `<p>${name}</p>${data.content}<p>Nguồn: <a href='${sourceLink}'>${sourceName}</a></p>`;
      const images = [
        {
          src: data.thumbnail.src,
          name: data.thumbnail.name,
        },
      ];
      const graphPhotos = new GraphFBPhoto();
      graphPhotos.setMessage(convert(contentPost));
      graphPhotos.setPhotos(images);

      const signalGetAccessToken = await this.fbIntegration.getAccessToken();

      if (signalGetAccessToken.error) {
        throw new BadRequestException(signalGetAccessToken);
      }

      const page_id =
        signalGetAccessToken?.data?.page_name || process.env.FACEBOOK_PAGE_ID;
      const access_token =
        signalGetAccessToken?.data?.access_token ||
        process.env.FACEBOOK_ACCESS_TOKEN;

      const graphPageFacebook = new FacebookIntegrationService(
        access_token,
        page_id,
      );

      let _axios: any = {};

      const metaData = graphPhotos.payload;

      _axios = await graphPageFacebook.publicContent(metaData);

      const code = _axios.error ? HttpStatus.BAD_REQUEST : HttpStatus.OK;

      return res.status(code).json(_axios);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: true, message: error.message });
    }
  }
}
