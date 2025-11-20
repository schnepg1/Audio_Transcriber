
import React from 'react';

interface TranscriptionDisplayProps {
  text: string;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ text }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: Show a temporary "Copied!" message
        // For simplicity, not adding state for this here.
        console.log("Transcription copied to clipboard");
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-sky-400">Transcription Result:</h2>
        <button
          onClick={handleCopy}
          className="bg-slate-600 hover:bg-slate-500 text-slate-200 text-xs font-medium py-1.5 px-3 rounded-md transition-colors duration-150 flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          <span>Copy</span>
        </button>
      </div>
      <div className="bg-slate-700 p-4 rounded-lg shadow">
        <pre className="whitespace-pre-wrap break-words text-slate-200 text-sm leading-relaxed font-sans">
          {text || "No transcription available yet."}
        </pre>
      </div>
    </div>
  );
};
