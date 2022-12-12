import { observer } from 'mobx-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { openSignatureRequestPopup } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

import { TweetResponseDto } from '../../dto/auth/twitter.dto';
import { useStores } from '../../stores';

const AuthPage = observer(function () {
  const { hiroUserStore, twitterUserStore } = useStores();

  const [tweet, updateTweet] = useState(
    `I'm playing Stanks, join me in bounty hunting!\n#stunks #btc #stacks #tookey`,
  );
  const [signed, setSigned] = useState(false);
  const [signature, updateSignature] = useState<string | null>(null);
  const [tweetResult, updateTweetResult] = useState<TweetResponseDto | null>(
    null,
  );

  useEffect(() => {
    if (signature && !signed) {
      setSigned(true);
      updateTweet(`${tweet}\n${signature}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const onHiroWalletAuth = () => hiroUserStore.authenticate();

  const onTwitterAuth = async () => {
    const data = await twitterUserStore.getAuthUrl();
    window.location.href = data.url;
  };

  const onTwitUpdate = (event: any) => {
    updateTweet(event.target.value);
  };

  const onSign = async () => {
    // const res = await twitterUserStore.tweet(tweet);
    // updateTweetResult(res);
    openSignatureRequestPopup({
      message: tweet,
      network: new StacksTestnet(), // for mainnet, `new StacksMainnet()`
      appDetails: {
        name: 'Stunks',
        icon: window.location.origin + '/vercel.svg',
      },
      onFinish(data) {
        updateSignature(data.signature);
        console.log('Signature of the message', data.signature);
        console.log('Use public key:', data.publicKey);
      },
    });
  };

  const onSubmit = async () => {
    const res = await twitterUserStore.tweet(tweet);
    updateTweetResult(res);
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex space-x-2 justify-center m-2">
        {!hiroUserStore.user ? (
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out"
            onClick={onHiroWalletAuth}
          >
            Authenticate Hiro
          </button>
        ) : (
          <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-scroll">
            <code className="font-mono text-base">
              {JSON.stringify(hiroUserStore.user, null, 2)}
            </code>
          </pre>
        )}
      </div>
      <div className="flex space-x-2 justify-center m-2">
        {!twitterUserStore.user ? (
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            onClick={onTwitterAuth}
          >
            Authenticate Twitter
          </button>
        ) : (
          <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-scroll">
            <code className="font-mono text-base">
              {JSON.stringify(twitterUserStore.user, null, 2)}
            </code>
          </pre>
        )}
      </div>
      {twitterUserStore.user && !tweetResult ? (
        <div className="flex space-x-2 justify-center m-2">
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                disabled={signed}
                id="comment"
                rows={4}
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                required
                value={tweet}
                onChange={onTwitUpdate}
              ></textarea>
            </div>
            <div className="flex items-center px-3 py-2 border-t dark:border-gray-600">
              <button
                disabled={signed}
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 disabled:bg-gray-600"
                onClick={onSign}
              >
                {signed ? 'Signed' : 'Sign'}
              </button>
              <div className="inline-flex w-1" />
              <button
                disabled={!!tweetResult}
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                onClick={onSubmit}
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {tweetResult ? (
        <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-scroll">
          <code className="font-mono text-base">
            {JSON.stringify(tweetResult, null, 2)}
          </code>
        </pre>
      ) : null}
    </>
  );
});

export default AuthPage;
