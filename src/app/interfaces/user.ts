export interface User {
    uid?: string;
    firstName?: string;
    lastName?: string;
    createBy?: string;
    createDate?: string;
    lastUpdateBy?: string;
    lastUpdateDate?: string;
    contactInformation?: ContactInformation;
    roles?: Roles;
    isAnonymous?: boolean;
    photoUrl?: string;
}
export interface Roles {
    subscriber?: boolean;
    editor?: boolean;
    admin?: boolean;
 }
export interface ContactInformation {
  id: string;
  homePhoneNumber?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  primaryContactMethod?: string;
  email?: string;
  emailVerified?: boolean;
  facebook?: string;
  twitter?: string;
  instragram?: string;
  linkedin?: string;
  createBy?: string;
  createDate?: string;
  lastUpdateBy?: string;
  lastUpdateDate?: string;
}
