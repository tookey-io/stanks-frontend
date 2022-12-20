import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { openSignatureRequestPopup } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';
import { TransactionVersion } from '@stacks/transactions';
import { getStxAddress } from '@stacks/wallet-sdk';

import { HiroUserDto } from '../../dto/auth/hiro.dto';
import WalletService from '../../services/wallet.service';
import { useStores } from '../../stores';

const RpsPlayer = observer(() => {
  const { hiroStore } = useStores();

  const [hiroUser, updateHiroUser] = useState<HiroUserDto | null>(null);
  const [virtualAddress, setVirtualAddress] = useState<string | null>(null);

  useEffect(() => {
    updateHiroUser(hiroStore.getUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hiroUser) return;
    if (hiroUser.rpsWallet) {
      setVirtualAddress(
        getStxAddress({
          account: hiroUser.rpsWallet.accounts[0],
          transactionVersion: TransactionVersion.Mainnet,
        }),
      );
    } else {
      const createVirtualWallet = async () => {
        try {
          const walletService = new WalletService();
          const wallet = await walletService.generateWallet(
            hiroUser?.profile.stxAddress.mainnet,
          );
          hiroStore.saveRpsWallet(wallet);

          const mainnetAddress = getStxAddress({
            account: wallet.accounts[0],
            transactionVersion: TransactionVersion.Mainnet,
          });

          const message = `I want to use ${mainnetAddress} for play a game`;
          openSignatureRequestPopup({
            message,
            network: new StacksMainnet(),
            appDetails: {
              name: process.env.NEXT_PUBLIC_APP_NANE || 'RPS',
              icon: 'https://tookey.io/icons/icon-256x256.png',
            },
            onFinish(data) {
              hiroStore.saveRpsSignature(data);

              setVirtualAddress(mainnetAddress);
            },
          });
        } catch (error) {
          console.log('error', error);
        }
      };
      createVirtualWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiroUser]);

  const onHiroWalletAuth = async () => {
    const user = await hiroStore.connect();
    if (user) updateHiroUser(user);
  };

  const onLogout = async () => {
    hiroStore.clearStorage();
    updateHiroUser(null);
    setVirtualAddress(null);
  };

  return hiroUser ? (
    <>
      <div className="mb-4">
        Static Address: {hiroUser?.profile.stxAddress.mainnet}
        <br />
        Game Address: {virtualAddress}
      </div>
      <button
        type="button"
        className="inline-flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
        onClick={onLogout}
      >
        Logout
        <svg
          className="w-5 h-5 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          ></path>
        </svg>
      </button>
    </>
  ) : (
    <button
      type="button"
      className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50 mr-2 mb-2"
      onClick={onHiroWalletAuth}
    >
      <svg
        className="mr-2"
        width="32"
        height="18"
        viewBox="0 0 32 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="currentColor"
          d="M18.7942 18L24.9384 8.99999L18.7942 0H6.14428V18H18.7942ZM6.14423 18L0 9.00001L6.14423 1.33755e-05V18ZM16.987 7.35642H14.2862L16.1829 4.5H14.749L12.4654 7.94584L10.1894 4.5H8.75558L10.6522 7.35642H7.9514V8.4597H16.987V7.35642ZM14.2331 10.6058L16.1525 13.5H14.7186L12.4654 10.0995L10.2122 13.5H8.78593L10.7053 10.6133H7.9514V9.51763H16.987V10.6058H14.2331Z"
        />
      </svg>
      Connect Hiro
    </button>
  );
});

export default RpsPlayer;
