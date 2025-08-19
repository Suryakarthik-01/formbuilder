import { useEffect } from 'react';

const ConsoleClear = ({ trigger = false }) => {
  useEffect(() => {
    if (trigger) {
      console.clear();
    }
  }, [trigger]);

  return null;
};

// Manual console clear function
export const clearConsole = () => {
  console.clear();
};

// Console clear button component
export const ConsoleClearButton = ({ className = "" }) => {
  return (
    <button
      onClick={clearConsole}
      className={`px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors ${className}`}
      title="Clear Console"
    >
      Clear Console
    </button>
  );
};

export default ConsoleClear;
