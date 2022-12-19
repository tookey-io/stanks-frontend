import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { UserData } from '@stacks/connect';

import { useStores } from '../stores';

export enum Moves {
  Rock = 1, // 001
  Scissors = 2, // 010
  Paper = 4, // 100
}

interface RpsStateResponseDto {
  status: 'created' | 'finished';
  winners?: string[];
  moves?: {
    [playerId: string]: string;
  };
}

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/rps`;

const RPS = observer(() => {
  const { hiroStore } = useStores();

  const [hiroUser, updateHiroUser] = useState<UserData | null>(null);
  const [roomId, setRoomId] = useState<null | string>(null);
  const [move, setMove] = useState<null | number>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitted, submit] = useState(false);
  const [isWaitingForPartner, setWaitingForPartner] = useState(false);
  const [response, setResponse] = useState<null | RpsStateResponseDto>(null);

  const getRandom = () => `${parseInt(`${Math.random() * 9999}`)}`;

  useEffect(() => {
    setRoomId(getRandom);
  }, []);

  useEffect(() => {
    console.log(hiroUser?.profile.stxAddress.mainnet, roomId, move);
    if (!canSubmit && hiroUser && roomId && move) setCanSubmit(true);
    else setCanSubmit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiroUser, roomId, move]);

  useEffect(() => {
    const postMove = async () => {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify({
            roomId,
            playerId: hiroUser?.profile.stxAddress.mainnet,
            hash: `${move}`,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) setWaitingForPartner(true);
      } catch (error) {
        console.log('error', error);
      }
    };

    if (isSubmitted && !isWaitingForPartner) postMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  useEffect(() => {
    if (!isWaitingForPartner) return;
    const getResult = async () => {
      try {
        const params = new URLSearchParams();
        params.set('roomId', roomId!);
        params.set('playerId', hiroUser?.profile.stxAddress.mainnet!);
        const res = await fetch(`${API_URL}?${params.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data: RpsStateResponseDto = await res.json();
        if (data && data.status) {
          if (data.status === 'finished') {
            setResponse(data);
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    const interval = setInterval(() => {
      if (!response) {
        getResult();
      }
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWaitingForPartner]);

  const onHiroWalletAuth = async () => {
    const user = await hiroStore.connect();
    updateHiroUser(user);
    console.log(user);
  };

  const roomUpdateHandler = (event: any) => {
    setRoomId(event.target.value);
  };

  const moveUpdateHandler = (moveId: number) => (event: any) => {
    if (moveId === move) setMove(null);
    else setMove(moveId);
  };

  const onSubmit = () => {
    if (!isSubmitted) {
      // api
      submit(true);
    }
  };

  const onRefresh = () => {
    setRoomId(getRandom);
    setMove(null);
    setCanSubmit(true);
    submit(false);
    setWaitingForPartner(false);
    setResponse(null);
  };

  return (
    <div className="flex flex-col w-96 m-auto items-center">
      <div className="m-10">
        {hiroUser ? (
          <div>PlayerId: {hiroUser?.profile.stxAddress.mainnet}</div>
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
        )}
      </div>
      <div className="w-96 m-10">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Choose a room
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Choose a room"
            value={roomId || ''}
            onChange={roomUpdateHandler}
          />
        </div>
      </div>
      <div className="m-10">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`inline-flex items-center py-3.5 px-4 text-sm font-medium rounded-l-lg border focus:z-10 focus:ring-2 text-white ${
              Moves.Rock !== move
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
            }`}
            onClick={moveUpdateHandler(Moves.Rock)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
            Rock
          </button>
          <button
            type="button"
            className={`inline-flex items-center py-3.5 px-4 text-sm font-medium border-t border-b focus:z-10 focus:ring-2 text-white ${
              Moves.Paper !== move
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
            }`}
            onClick={moveUpdateHandler(Moves.Paper)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
            Paper
          </button>
          <button
            type="button"
            className={`inline-flex items-center py-3.5 px-4 text-sm font-medium rounded-r-md border focus:z-10 focus:ring-2 text-white ${
              Moves.Scissors !== move
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
            }`}
            onClick={moveUpdateHandler(Moves.Scissors)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
              ></path>
            </svg>
            Scissors
          </button>
        </div>
      </div>
      <div className="m-10">
        {!isWaitingForPartner ? (
          <button
            type="button"
            className="font-medium rounded-lg text-sm px-5 py-3.5 text-center inline-flex items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800  disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            Submit
            <svg
              aria-hidden="true"
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        ) : response ? (
          <>
            <div className="flex flex-col mb-10 items-center">
              {!response.winners?.length
                ? '🤷‍♂️ Draw'
                : response.winners?.includes(
                    hiroUser?.profile.stxAddress.mainnet,
                  )
                ? '🎉 You won'
                : '🤦‍♂️ You loose'}
            </div>
            <button
              type="button"
              className="font-medium rounded-lg text-sm px-5 py-3.5 text-center inline-flex items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800  disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onRefresh}
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
              Again
            </button>
          </>
        ) : (
          <div role="status">
            <svg
              className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default RPS;
