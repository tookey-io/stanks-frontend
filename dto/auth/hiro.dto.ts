import { SignatureData, UserData } from '@stacks/connect';

export interface HiroUserDto extends UserData {
  signatureData?: SignatureData;
}
