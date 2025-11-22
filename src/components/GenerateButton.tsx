interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

export const GenerateButton = ({ onClick, isGenerating }: GenerateButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isGenerating}
      className={`
        w-full px-8 py-6
        bg-accent border-4 border-double border-ink
        text-paper font-headline text-2xl uppercase tracking-widest
        rounded-lg shadow-xl
        transition-all duration-300
        ${
          isGenerating
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:bg-accent-vintage hover:shadow-2xl hover:-translate-y-1 active:translate-y-0'
        }
      `}
    >
      {isGenerating ? (
        <span className="animate-pulse-slow">🕊️ Condoleance wordt opgesteld...</span>
      ) : (
        <span>🕊️ Genereer Condoleance</span>
      )}
    </button>
  );
};
