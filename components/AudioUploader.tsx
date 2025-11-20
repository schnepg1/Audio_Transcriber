
import React, { useCallback, useState } from 'react';

interface AudioUploaderProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onFileSelect(event.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full">
      <label
        htmlFor="audio-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          flex flex-col items-center justify-center w-full h-48 
          border-2 border-dashed rounded-lg cursor-pointer 
          bg-slate-700 hover:bg-slate-600 transition-colors duration-200
          ${isDragging ? 'border-sky-400 bg-slate-600' : 'border-slate-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
           <svg className="w-10 h-10 mb-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          <p className="mb-2 text-sm">
            <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs">MP3, WAV, OGG, FLAC, etc. (Max 50MB)</p>
        </div>
        <input
          id="audio-upload"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </label>
    </div>
  );
};
