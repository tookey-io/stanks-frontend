import { Wallet, generateSecretKey, generateWallet } from '@stacks/wallet-sdk';

export default class WalletService {
  wallet: null | Wallet = null;

  async generateWallet(password: string): Promise<Wallet> {
    const secretKey = generateSecretKey();
    return await generateWallet({ secretKey, password });
  }
}
