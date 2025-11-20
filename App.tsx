
import React, { useState, useCallback } from 'react';
import { AudioUploader } from './components/AudioUploader';
import { TranscriptionDisplay } from './components/TranscriptionDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { transcribeAudio as callTranscribeAudio } from './services/geminiService';
import { FileAudio, UploadCloud, AlertTriangle } from 'lucide-react'; // Using lucide-react for icons

// Ensure lucide-react is available, if not, use SVGs or remove icons.
// For this example, assuming lucide-react could be added or replaced with SVGs.
// If direct SVG is preferred, replace <FileAudio />, <UploadCloud />, etc. with actual SVG code.

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File | null) => {
    setSelectedFile(file);
    setTranscription(''); // Clear previous transcription
    setError(null); // Clear previous error
  }, []);

  const handleTranscribe = async () => {
    if (!selectedFile) {
      setError("Please select an audio file first.");
      return;
    }

    setIsLoading(true);
    setTranscription('');
    setError(null);

    try {
      const result = await callTranscribeAudio(selectedFile);
      setTranscription(result);
    } catch (err: any) {
      console.error("Transcription error:", err);
      setError(err.message || "An unknown error occurred during transcription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-sky-500 selection:text-white">
      <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-10 w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-sky-400 flex items-center justify-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            <span>Audio Transcriber AI</span>
          </h1>
          <p className="text-slate-400 mt-2">Upload your audio file and let AI transcribe it for you.</p>
        </header>

        <main className="space-y-6">
          <AudioUploader onFileSelect={handleFileSelect} disabled={isLoading} />

          {selectedFile && !isLoading && (
            <div className="text-sm text-slate-400 bg-slate-700 p-3 rounded-md flex items-center space-x-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1z"/><path d="M16 12a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1z"/></svg>
              <span>Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)</span>
            </div>
          )}

          <button
            onClick={handleTranscribe}
            disabled={!selectedFile || isLoading}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            {isLoading ? (
              <LoadingSpinner small={true} />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 10.267-4.09 4.09a1.404 1.404 0 0 1-1.988-1.987L10.013 8.28a1.404 1.404 0 0 1 1.987 0l4.09 4.09a1.404 1.404 0 0 1-1.988 1.987L12 10.267Z"/><path d="m3.788 8.438 4.09 4.09a1.404 1.404 0 0 0 1.987 0l1.87-1.87"/><path d="m14.26 10.543 1.87-1.87a1.404 1.404 0 0 0 0-1.987l-4.09-4.09a1.404 1.404 0 0 0-1.987 0L5.973 6.728"/><path d="m12 19.652 4.09-4.09a1.404 1.404 0 0 1 1.988 1.987L13.987 21.64a1.404 1.404 0 0 1-1.987 0l-4.09-4.09a1.404 1.404 0 0 1 1.988-1.987L12 19.653Z"/><path d="m3.788 15.562 4.09-4.09a1.404 1.404 0 0 0 1.987 0l1.87 1.87"/><path d="m14.26 13.457 1.87 1.87a1.404 1.404 0 0 0 0 1.987l-4.09 4.09a1.404 1.404 0 0 0-1.987 0l-4.09-4.09"/></svg>
            )}
            <span>{isLoading ? 'Transcribing...' : 'Transcribe Audio'}</span>
          </button>

          {isLoading && !transcription && (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-700 rounded-lg">
              <LoadingSpinner />
              <p className="mt-3 text-slate-300">Processing audio, please wait...</p>
            </div>
          )}

          {error && <ErrorMessage message={error} />}
          
          {transcription && !isLoading && (
            <TranscriptionDisplay text={transcription} />
          )}
        </main>
        
        <footer className="text-center text-xs text-slate-500 pt-6 border-t border-slate-700">
            Powered by Gemini API & React.
        </footer>
      </div>
    </div>
  );
};

export default App;
