import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export function ThemeTest() {
  const context = useContext(ThemeContext);
  
  console.log('ThemeTest component rendered');
  console.log('ThemeContext import:', ThemeContext);
  console.log('Context value:', context);
  
  if (!context) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded text-red-800">
        <p className="font-bold">Context Error</p>
        <p>ThemeContext is undefined or not provided</p>
        <p>ThemeContext type: {typeof ThemeContext}</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-green-100 border border-green-400 rounded text-green-800">
      <p className="font-bold">Context OK</p>
      <p>Current theme: {context.theme}</p>
      <button
        onClick={context.toggleTheme}
        className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
      >
        Toggle Theme
      </button>
    </div>
  );
}
