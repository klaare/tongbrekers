interface LevenslesButtonProps {
    onClick: () => void;
    isGenerating: boolean;
}

export const LevenslesButton = ({ onClick, isGenerating }: LevenslesButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={isGenerating}
            className={`
        w-full px-8 py-6
        bg-red-950 border-4 border-double border-red-800
        text-white font-headline text-2xl uppercase tracking-widest
        rounded-lg shadow-[0_0_15px_rgba(153,27,27,0.3)]
        transition-all duration-300 font-bold
        ${isGenerating
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-red-900 hover:border-red-600 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0'
                }
      `}
        >
            {isGenerating ? (
                <span className="animate-pulse-slow">De afgrond staart terug...</span>
            ) : (
                <span>Oproep tot Wanhoop</span>
            )}
        </button>
    );
};
