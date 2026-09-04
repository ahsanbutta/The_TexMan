import React, { useState, useRef } from 'react';
import {
  Link as LinkIcon,
  UploadCloud,
  X,
  FileText,
  CheckCircle,
  Eye,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

export default function DualMediaUpload({
  type = 'image', // 'image' | 'file'
  value = '',
  onChange,
  label = 'Media Upload',
  accept,
  presets = [],
  placeholder,
  maxSizeMB = 10,
  className = ''
}) {
  const isDataUrl = typeof value === 'string' && value.startsWith('data:');
  const isBlobUrl = typeof value === 'string' && value.startsWith('blob:');
  const isLocalUpload = isDataUrl || isBlobUrl;

  const [mode, setMode] = useState(isLocalUpload ? 'device' : 'url'); // 'url' | 'device'
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const defaultAccept = type === 'image'
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : '.pdf,.doc,.docx,.zip,.xlsx,.xls';

  const defaultPlaceholder = type === 'image'
    ? 'https://images.unsplash.com/... or any image link'
    : 'https://example.com/document.pdf or Google Drive link';

  // Process File from Input or Drag
  const handleFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`File size exceeds maximum limit of ${maxSizeMB}MB.`);
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setFileName(file.name);
    setFileSize(sizeFormatted);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file from your device.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = (e) => {
    if (e) e.stopPropagation();
    onChange('');
    setFileName('');
    setFileSize('');
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {/* Label and Mode Switch Tabs */}
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-700 text-xs flex items-center space-x-1.5">
          {type === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-brandGreen" /> : <FileText className="w-3.5 h-3.5 text-brandGreen" />}
          <span>{label}</span>
        </label>

        <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => { setMode('url'); setErrorMsg(''); }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === 'url'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Web URL</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('device'); setErrorMsg(''); }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === 'device'
                ? 'bg-white text-brandGreen font-black shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Upload from Device</span>
          </button>
        </div>
      </div>

      {/* Mode 1: URL Input */}
      {mode === 'url' && (
        <div className="space-y-2">
          <div className="relative flex items-center">
            <input
              type="url"
              placeholder={placeholder || defaultPlaceholder}
              value={isDataUrl ? '' : value}
              onChange={(e) => {
                setFileName('');
                setFileSize('');
                onChange(e.target.value);
              }}
              className="w-full p-2.5 pl-8 pr-8 border border-gray-200 bg-[#F8F9FB] rounded-xl focus:outline-none focus:border-brandGreen text-xs text-gray-800 font-medium"
            />
            <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
            {value && !isDataUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Presets if provided */}
          {presets.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-gray-400 font-semibold">Presets:</span>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFileName('');
                    setFileSize('');
                    onChange(preset.url);
                  }}
                  className="px-2 py-0.5 rounded bg-gray-100 hover:bg-brandGreen/10 hover:text-brandGreen text-[10px] font-bold text-gray-600 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Upload from Device */}
      {mode === 'device' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept || defaultAccept}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-brandGreen bg-brandGreen/5'
                : 'border-gray-200 bg-[#F8F9FB] hover:border-brandGreen/40 hover:bg-gray-50'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-brandGreen/10 text-brandGreen flex items-center justify-center mb-1.5">
              <UploadCloud className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-gray-800">
              Click to browse <span className="text-brandGreen">or drag & drop file</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {type === 'image'
                ? `PNG, JPG, WebP, GIF up to ${maxSizeMB}MB`
                : `PDF, Word DOCX, ZIP up to ${maxSizeMB}MB`}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <p className="text-[11px] text-red-500 font-semibold">{errorMsg}</p>
      )}

      {/* Preview Card (Shows for both URL or Device Upload if valid value exists) */}
      {value && (
        <div className="p-2.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            {type === 'image' ? (
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-brandGreen/10 text-brandGreen flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}

            <div className="overflow-hidden text-left">
              <p className="text-xs font-bold text-gray-800 truncate">
                {fileName || (isDataUrl ? 'Uploaded from Device' : value)}
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-gray-400 mt-0.5">
                <span className="flex items-center space-x-1 text-brandGreen font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  <span>Ready</span>
                </span>
                {fileSize && <span>• {fileSize}</span>}
                {!isDataUrl && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-brandGreen underline inline-flex items-center gap-0.5"
                  >
                    <span>View link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            {mode === 'device' && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Change
              </button>
            )}
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
