import { Moves } from './RpsGame';

interface RpsActionsProps {
  onSelect: (move: number) => (event: any) => void;
  selected?: Moves | null;
}

const RpsActions = ({ onSelect, selected }: RpsActionsProps) => (
  <div className="inline-flex rounded-md shadow-sm" role="group">
    <button
      type="button"
      className={`inline-flex items-center py-3.5 px-4 text-sm font-medium rounded-l-lg border focus:z-10 focus:ring-2 text-white ${
        Moves.Rock !== selected
          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
          : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
      }`}
      onClick={onSelect(Moves.Rock)}
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
        Moves.Paper !== selected
          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
          : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
      }`}
      onClick={onSelect(Moves.Paper)}
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
        Moves.Scissors !== selected
          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
          : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
      }`}
      onClick={onSelect(Moves.Scissors)}
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
);
export default RpsActions;
