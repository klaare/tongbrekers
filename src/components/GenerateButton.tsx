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
        bg-gradient-to-br from-primary to-primary-dark
        text-white font-bold text-xl uppercase tracking-wider
        rounded-2xl shadow-2xl
        transition-all duration-300
        ${
          isGenerating
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:shadow-primary/50 hover:-translate-y-1 active:translate-y-0'
        }
      `}
    >
      {isGenerating ? (
        <span className="animate-pulse-slow">🔄 Taal aan het verknopen...</span>
      ) : (
        <span>🔥 Genereer Tering Condoleance 🔥</span>
      )}
    </button>
  );
};
