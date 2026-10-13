'use client';

import { useId, useRef, useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  label: string;
  folder: string;
  images: string[];
  multiple?: boolean;
  disabled?: boolean;
  onChange: (images: string[]) => void;
  onBusyChange: (busy: boolean) => void;
}

const MAX_SIZE = 4 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploader({
  label,
  folder,
  images,
  multiple = false,
  disabled = false,
  onChange,
  onBusyChange,
}: ImageUploaderProps) {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const locked = busy || disabled;

  async function uploadFiles(files: File[]) {
    if (busyRef.current || disabled || !files.length) return;
    const selected = multiple ? files : files.slice(0, 1);
    if (multiple && images.length + selected.length > 12) {
      setError('You can add up to 12 gallery images.');
      return;
    }
    const invalid = selected.find(
      (file) => !TYPES.includes(file.type) || !file.size || file.size > MAX_SIZE
    );
    if (invalid) {
      setError(`${invalid.name}: choose a JPEG, PNG, or WebP image up to 4 MB.`);
      return;
    }
    busyRef.current = true;
    setBusy(true);
    onBusyChange(true);
    setError('');
    let next = multiple ? [...images] : [];
    let completed = 0;
    try {
      for (let index = 0; index < selected.length; index++) {
        const file = selected[index];
        const preview = URL.createObjectURL(file);
        setPendingPreview(preview);
        setStatus(`Uploading ${index + 1} of ${selected.length}: ${file.name}`);
        setProgress(0);
        try {
          const url = await new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `/api/upload?folder=${encodeURIComponent(folder)}`);
            xhr.timeout = 60000;
            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable)
                setProgress(Math.round((event.loaded * 100) / event.total));
            };
            xhr.onload = () => {
              try {
                const result = JSON.parse(xhr.responseText);
                if (
                  xhr.status >= 200 &&
                  xhr.status < 300 &&
                  result.success &&
                  typeof result.url === 'string'
                )
                  resolve(result.url);
                else reject(new Error(result.message || 'Upload failed. Please try again.'));
              } catch {
                reject(new Error('Upload failed. Please sign in again or try a smaller image.'));
              }
            };
            xhr.onerror = () => reject(new Error('Connection lost. Please try again.'));
            xhr.ontimeout = () => reject(new Error('Upload timed out. Please try again.'));
            const data = new FormData();
            data.append('file', file);
            xhr.send(data);
          });
          next = [...next, url];
          onChange(next);
          completed++;
        } finally {
          URL.revokeObjectURL(preview);
          setPendingPreview(null);
        }
      }
      setStatus(
        `${completed} ${completed === 1 ? 'image' : 'images'} uploaded. Save the project to publish your changes.`
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Upload failed. Please try again.');
      setStatus(
        completed ? `${completed} images uploaded. Select the remaining files to retry.` : ''
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
      onBusyChange(false);
      if (input.current) input.current.value = '';
    }
  }

  return (
    <section
      aria-labelledby={`${inputId}-label`}
      className="space-y-4 rounded-2xl border border-border/60 bg-muted/10 p-5"
    >
      <h3 id={`${inputId}-label`} className="text-sm font-semibold">
        {label}
      </h3>
      <input
        ref={input}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        disabled={locked}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => void uploadFiles(Array.from(event.target.files || []))}
      />
      <div
        className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${dragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-border bg-background/40'} ${locked ? 'opacity-60' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          if (!locked) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!locked) void uploadFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <UploadCloud className="mx-auto mb-3 h-8 w-8 text-indigo-400" aria-hidden="true" />
        <p className="text-sm font-medium">Drag and drop {multiple ? 'images' : 'an image'} here</p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPEG, PNG or WebP · Up to 4 MB each{multiple ? ' · Up to 12 images' : ''}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          disabled={locked}
          onClick={() => input.current?.click()}
        >
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {busy
            ? 'Uploading…'
            : multiple
              ? 'Choose images'
              : images.length
                ? 'Replace image'
                : 'Choose image'}
        </Button>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted"
            >
              <Image
                src={url}
                alt={`${label} ${index + 1}`}
                fill
                sizes="(max-width: 640px) 45vw, 240px"
                className="object-cover"
              />
              <button
                type="button"
                aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
                disabled={locked}
                onClick={() => onChange(images.filter((_, i) => i !== index))}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-600 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      {busy && (
        <div className="space-y-2">
          {pendingPreview && (
            <div className="relative h-20 w-32 overflow-hidden rounded-lg">
              <Image
                src={pendingPreview}
                unoptimized
                alt="Uploading image preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <progress
            aria-label="Upload progress"
            value={progress}
            max={100}
            className="h-2 w-full accent-indigo-500"
          />
          <p className="text-xs text-muted-foreground">
            {progress === 100 ? 'Finishing upload…' : `${progress}% uploaded`}
          </p>
        </div>
      )}
      <p role="status" aria-live="polite" className="text-xs text-muted-foreground">
        {status}
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </section>
  );
}
