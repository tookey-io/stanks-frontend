import { useStores } from '../stores';
import { Game } from './game/Game';
import { demoScenario } from '../models/demo';
import { observer } from 'mobx-react-lite';

const Layout: React.FC<React.PropsWithChildren<{}>> = observer(
  ({ children }) => {
    const { gameStore } = useStores();
    const state = JSON.parse(JSON.stringify(gameStore));

    console.log(state);

    return (
      <div>
        <div className="fixed inset-0">
          <Game {...state} />
        </div>

        <div className="absolute left-0 top-0 p-10 bg-gray">
          <button
            className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50 mr-2 mb-2"
            onClick={() => {
              console.log('test');
              gameStore.reset();
              demoScenario(gameStore);
            }}
          >
            Demo
          </button>
        </div>

        <div className="fixed top-0 bottom-0 right-0 w-5/12 p-10 bg-black overflow-auto">
          {children}
        </div>
      </div>
    );
  },
);

export default Layout;
