export interface UserEntity {
  id: string;
  email: string;
  verifiedEmail?: boolean;
  name: string;
  givenName?: string;
  familyName?: string;
  picture: string;
  locale: string;
}
