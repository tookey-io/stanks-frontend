import { SignatureData, UserData } from '@stacks/connect';
import { Wallet } from '@stacks/wallet-sdk';

export interface HiroUserDto extends UserData {
  stanksSignature?: SignatureData;
  rpsSignature?: SignatureData;
  rpsWallet?: Wallet;
}
