export abstract class ABSPublicContentSocial {
  protected abstract getAuthorization(): Promise<any>;
  protected abstract getAccessToken(): Promise<any>;
  protected abstract publicContent<T>(meta: T): Promise<any>;
}
