import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { UserData, openSignatureRequestPopup } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';

import Layout from '../components/Layout';
import { TwitterUserDto } from '../dto/auth/twitter.dto';
import { useStores } from '../stores';

const AuthPage = observer(() => {
  const { hiroStore, twitterStore } = useStores();

  const [step, setStep] = useState(0);
  const [hiroUser, updateHiroUser] = useState<UserData | null>(null);
  const [twitterUser, updateTwitterUser] = useState<TwitterUserDto | null>(
    null,
  );

  const [tweet, updateTweet] = useState(
    [
      "I'm playing Stanks, join me in bounty hunting!",
      ['#stanks', '#btc', '#stacks', '#tookey'].join(' '),
    ].join('\n'),
  );
  const [signed, setSigned] = useState(false);
  const [signature, updateSignature] = useState<string | null>(null);

  useEffect(() => {
    updateHiroUser(hiroStore.getUser());
    updateTwitterUser(twitterStore.getUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hiroUser && twitterUser && twitterUser.tweet?.id) {
      updateTweet(twitterUser.tweet.text);
      return setStep(4);
    }
    if (hiroUser && twitterUser) return setStep(3);
    if (hiroUser && !twitterUser) return setStep(2);
    if (!hiroUser) return setStep(1);
  }, [hiroUser, signature, twitterUser]);

  useEffect(() => {
    if (signature && !signed) {
      setSigned(true);
      updateTweet(`${tweet}\n${signature}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const onHiroWalletAuth = async () => {
    const user = await hiroStore.connect();
    updateHiroUser(user);
  };

  const onTwitterAuth = async () => {
    const data = await twitterStore.getAuthUrl();
    window.location.href = data.url;
  };

  const tweetUpdateHandler = (event: any) => {
    updateTweet(event.target.value);
  };

  const onSign = async () => {
    openSignatureRequestPopup({
      message: tweet,
      network: new StacksMainnet(),
      appDetails: {
        name: process.env.NEXT_PUBLIC_APP_NANE || 'Stanks',
        icon: 'https://tookey.io/icons/icon-256x256.png',
      },
      onFinish(data) {
        const signature = Buffer.from(data.signature, 'hex').toString('base64');
        hiroStore.saveSignature(data);
        updateSignature(signature);
      },
    });
  };

  const onTweet = async () => {
    await twitterStore.tweet(tweet);
    updateTwitterUser(twitterStore.getUser());
  };

  const onClear = () => {
    hiroStore.clearStorage();
    twitterStore.clearStorage();
    updateHiroUser(null);
    updateTwitterUser(null);
  };

  return (
    <Layout>
      <div className="max-w-xl justify-center m-auto mb-10">
        <h2 className="text-3xl font-extrabold dark:text-white mb-8">
          To{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            join Stanks
          </span>{' '}
          game, simply follow these three easy steps.
        </h2>
        <ol className="relative border-l border-gray-200 dark:border-gray-700 mb-6">
          <li className="mb-6 ml-4">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <div className={step !== 1 ? ' opacity-30' : ''}>
              <span className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Step 1
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Connect Hiro Wallet
              </h3>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Hiro Wallet is an integral part of Stanks game mechanics, as it
                enables you to utilize our anonymous decentralized voting
                technology and collect your Bitcoin rewards.
              </p>
              <button
                disabled={step !== 1}
                type="button"
                className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50 mr-2 mb-2"
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
                {step > 1 ? 'Connected' : 'Connect'}
              </button>
            </div>
          </li>
          <li className="mb-6 ml-4">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <div className={step !== 2 ? ' opacity-30' : ''}>
              <span className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Step 2
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Signin with Twitter
              </h3>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                In order to participate in the game round, you must connect your
                Twitter account.
              </p>
              <button
                disabled={step !== 2}
                type="button"
                className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 disabled:cursor-not-allowed disabled:opacity-50 mr-2 mb-2"
                onClick={onTwitterAuth}
              >
                <svg
                  className="mr-3 -ml-1 w-5 h-5"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="twitter"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"
                  ></path>
                </svg>
                {step > 2 ? 'Authenticated' : 'Authenticate'}
              </button>
            </div>
          </li>
          <li className="mb-6 ml-4">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <div className={step !== 3 ? ' opacity-30' : ''}>
              <span className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Step 3
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sign and tweet
              </h3>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Add your signature to the player&apos;s message and post it on
                your Twitter account. No fees will be incurred.
              </p>
              <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                  <label htmlFor="comment" className="sr-only">
                    Tweet
                  </label>
                  <textarea
                    disabled={step !== 3 || signed}
                    id="comment"
                    rows={3}
                    className="w-full px-0 text-sm lg:text-xl text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 focus:outline-0 dark:text-white dark:placeholder-gray-400 resize-none"
                    required
                    value={tweet}
                    onChange={tweetUpdateHandler}
                  ></textarea>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center px-3 py-2 border-t dark:border-gray-600">
                  <button
                    disabled={
                      step !== 3 ||
                      signed ||
                      !!(twitterUser && twitterUser.tweet)
                    }
                    className="inline-flex justify-center w-full mb-2 sm:w-auto sm:mr-2 sm:mb-0 md:w-full md:mr-0 md:mb-2 lg:w-auto lg:mr-2 lg:mb-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600 disabled:dark:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={onSign}
                  >
                    {signed ? 'Signed' : 'Sign Message'}
                    <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                      ></path>
                    </svg>
                  </button>
                  <button
                    disabled={step !== 3 || !signed}
                    className="inline-flex justify-center w-full sm:w-auto md:w-full lg:w-auto text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600 disabled:dark:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={onTweet}
                  >
                    Tweet
                    <svg
                      className="ml-3 w-5 h-5 rotate-90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </li>
          <li className="ml-4">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <span className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              Finish
            </span>
            <div className={step !== 4 ? 'hidden' : ''}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Well Done
              </h3>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Congratulations on completing the signup process! You are now
                ready to play Stanks. We invite you to join our Discord
                community to stay up-to-date on official announcements and to
                connect with other players in the game.
              </p>
              <div className="flex flex-col md:flex-row">
                <button
                  disabled
                  type="button"
                  className="flex-inline w-full md:w-auto md:mr-2 mb-2 md:mb-0 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Play Stanks!
                </button>
                <a
                  className="flex-inline justify-center w-full md:w-auto text-white bg-[#7289da] hover:bg-[#7289da]/90 focus:ring-4 focus:outline-none focus:ring-[#7289da]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#7289da]/55"
                  href="https://discord.gg/5cuf73JhFS"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="mr-3 -ml-1 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      fill="currentColor"
                      d="M10.076 11c.6 0 1.086.45 1.075 1 0 .55-.474 1-1.075 1C9.486 13 9 12.55 9 12s.475-1 1.076-1zm3.848 0c.601 0 1.076.45 1.076 1s-.475 1-1.076 1c-.59 0-1.075-.45-1.075-1s.474-1 1.075-1zm4.967-9C20.054 2 21 2.966 21 4.163V23l-2.211-1.995-1.245-1.176-1.317-1.25.546 1.943H5.109C3.946 20.522 3 19.556 3 18.359V4.163C3 2.966 3.946 2 5.109 2H18.89zm-3.97 13.713c2.273-.073 3.148-1.596 3.148-1.596 0-3.381-1.482-6.122-1.482-6.122-1.48-1.133-2.89-1.102-2.89-1.102l-.144.168c1.749.546 2.561 1.334 2.561 1.334a8.263 8.263 0 0 0-3.096-1.008 8.527 8.527 0 0 0-2.077.02c-.062 0-.114.011-.175.021-.36.032-1.235.168-2.335.662-.38.178-.607.305-.607.305s.854-.83 2.705-1.376l-.103-.126s-1.409-.031-2.89 1.103c0 0-1.481 2.74-1.481 6.121 0 0 .864 1.522 3.137 1.596 0 0 .38-.472.69-.871-1.307-.4-1.8-1.24-1.8-1.24s.102.074.287.179c.01.01.02.021.041.031.031.022.062.032.093.053.257.147.514.262.75.357.422.168.926.336 1.513.452a7.06 7.06 0 0 0 2.664.01 6.666 6.666 0 0 0 1.491-.451c.36-.137.761-.337 1.183-.62 0 0-.514.861-1.862 1.25.309.399.68.85.68.85z"
                    />
                  </svg>
                  Join our Discord
                </a>
              </div>
            </div>
          </li>
        </ol>
        <button
          type="button"
          className="inline-flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
          onClick={onClear}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Start over
        </button>
      </div>
    </Layout>
  );
});

export default AuthPage;
