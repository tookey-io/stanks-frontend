import { useEffect, useState } from 'react';

import { RpsRoomDto } from './RpsGame';

interface RpsRoomProps {
  onSelect: (value: string | null) => void;
  room: RpsRoomDto | null;
}
const RpsRoom = ({ onSelect, room }: RpsRoomProps) => {
  const [roomId, setRoomId] = useState<string>('');
  const [isJoined, join] = useState(false);

  const getRandom = () => `${parseInt(`${Math.random() * 9999}`)}`;

  useEffect(() => {
    setRoomId(getRandom());
  }, []);

  const onChange = (event: any) => {
    setRoomId(event.target.value);
  };

  const onSubmit = () => {
    if (!isJoined) {
      onSelect(roomId);
      join(true);
    } else {
      onSelect(null);
      join(false);
    }
  };

  return (
    <>
      <label
        htmlFor="room"
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
          type="room"
          id="room"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Choose a room"
          value={roomId}
          disabled={isJoined}
          onChange={onChange}
        />
        {!isJoined ? (
          <button
            className="text-white absolute right-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={onSubmit}
          >
            Join Room
          </button>
        ) : (
          <button
            className="text-white absolute right-2.5 bottom-2.5 bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
            onClick={onSubmit}
          >
            Leave Room
          </button>
        )}
      </div>
      {room && Object.keys(room).length ? (
        <div className="mt-10">
          <h6 className="text-lg font-bold dark:text-white">Players</h6>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.keys(room).map((key) => (
              <li key={key} className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
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
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {key}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      Connected
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default RpsRoom;
