interface RpsResultProps {
  winners?: string[];
  playerAddress: string;
  onRefresh: () => void;
  visible?: boolean;
}

const RpsResult = ({
  winners,
  playerAddress,
  onRefresh,
  visible,
}: RpsResultProps) => {
  if (!visible) return null;

  return (
    <>
      <div className="flex flex-col mb-4 items-center">
        {!winners?.length
          ? '🤷‍♂️ Draw'
          : winners?.includes(playerAddress)
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
  );
};

export default RpsResult;
