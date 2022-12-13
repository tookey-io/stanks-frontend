import { observer } from 'mobx-react-lite';
import Head from 'next/head';

import { demoScenario } from '../models/demo';
import { useStores } from '../stores';
import { Game } from './game/Game';

const Layout: React.FC<React.PropsWithChildren<{}>> = observer(
  ({ children }) => {
    const { gameStore } = useStores();
    const state = JSON.parse(JSON.stringify(gameStore));

    console.log(state);

    return (
      <>
        <Head>
          <title>Stanks Online</title>
          <meta
            name="description"
            content="Stanks is a real-time strategy game with a diplomatic and cooperative theme"
          />
          <link rel="icon" href="/favicon-32x32.png" />
        </Head>
        <div className="h-[calc(100vh_-_18rem)] md:h-auto md:fixed md:inset-0">
          <Game {...state} />
        </div>

        <div className="absolute left-0 top-0 m-10 bg-gray">
          <button
            className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              console.log('test');
              gameStore.reset();
              demoScenario(gameStore);
            }}
          >
            Demo
          </button>
        </div>

        <div className="md:fixed md:top-0 md:bottom-0 md:right-0 md:w-5/12 p-10 bg-black md:overflow-auto">
          {children}
        </div>
      </>
    );
  },
);

export default Layout;
