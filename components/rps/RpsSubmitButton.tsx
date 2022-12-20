interface RpsSubmitButtonProps {
  isActive?: boolean;
  onSubmit: () => void;
}

const RpsSubmitButton = ({ isActive, onSubmit }: RpsSubmitButtonProps) => {
  return (
    <button
      type="button"
      className="font-medium rounded-lg text-sm px-5 py-3.5 text-center inline-flex items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800  disabled:cursor-not-allowed disabled:opacity-50"
      disabled={!isActive}
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
  );
};

export default RpsSubmitButton;
