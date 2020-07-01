import {firestore} from "firebase";

export interface User {
    uid?: string;
    gender?: string;
    dateOfBirth?: firestore.Timestamp;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    createBy?: string;
    createDate?: firestore.Timestamp;
    lastUpdateBy?: string;
    lastUpdateDate?: firestore.Timestamp;
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
  address?: string;
  homePhoneNumber?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  primaryContactMethod?: string;
  email?: string;
  emailVerified?: boolean;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  createBy?: string;
  createDate?: firestore.Timestamp;
  lastUpdateBy?: string;
  lastUpdateDate?: firestore.Timestamp;
}
