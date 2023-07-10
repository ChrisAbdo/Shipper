'use client';

import React from 'react';

import { BlobResult } from '@vercel/blob';
import { Button } from '@/components/ui/button';
import {
  CheckIcon,
  Link2Icon,
  ReloadIcon,
  UploadIcon,
} from '@radix-ui/react-icons';

import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function UploadForm() {
  const { toast } = useToast();

  const [data, setData] = React.useState<{
    image: string | null;
  }>({
    image: null,
  });
  const [file, setFile] = React.useState<File | null>(null);

  const [dragActive, setDragActive] = React.useState(false);

  const [uploadedFileURL, setUploadedFileURL] = React.useState<string | null>(
    null
  );

  const [copied, setCopied] = React.useState(false);

  const handleCopied = React.useCallback(() => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, []);

  const onChangePicture = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          //   toast.error('File size too big (max 50MB)')
          console.log('File size too big (max 50MB)');
        } else {
          setFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData]
  );

  const [saving, setSaving] = React.useState(false);

  const saveDisabled = React.useMemo(() => {
    return !data.image || saving;
  }, [data.image, saving]);

  return (
    <form
      className="grid gap-6 mt-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        fetch('/api/upload', {
          method: 'POST',
          headers: { 'content-type': file?.type || 'application/octet-stream' },
          body: file,
        }).then(async (res) => {
          if (res.status === 200) {
            const { url } = (await res.json()) as BlobResult;

            // Update the uploaded file's URL state
            setUploadedFileURL(url);

            console.log('File uploaded! Your file has been uploaded to ' + url);
            toast({
              title: 'File uploaded!',
              description: 'You can view your file on the listen page.',
            });
          } else {
            const error = await res.text();
            console.log(error);
          }
          setSaving(false);
        });
      }}
    >
      <div>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border shadow-sm transition-all "
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              const file = e.dataTransfer.files && e.dataTransfer.files[0];
              if (file) {
                if (file.size / 1024 / 1024 > 50) {
                  console.log('File size too big (max 50MB)');
                } else {
                  setFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setData((prev) => ({
                      ...prev,
                      image: e.target?.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />
          <div
            className={`${
              dragActive ? 'border-2 border-black' : ''
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data.image
                ? 'bg-background/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md'
                : 'bg-background opacity-100 hover:bg-background/80 hover:backdrop-blur-md'
            }`}
          >
            <UploadIcon
              className={`${
                dragActive ? 'scale-110' : 'scale-100'
              } h-7 w-7 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
            />
            <p className="mt-2 text-center text-sm ">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm ">Max file size: 50MB</p>
            <span className="sr-only">Photo upload</span>
          </div>
          {data.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.image}
              alt="Preview"
              className="h-full w-full rounded-md object-cover"
            />
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*,video/*,audio/*"
            className="sr-only"
            onChange={onChangePicture}
          />
        </div>
      </div>

      <Button disabled={saveDisabled}>
        {saving ? (
          <div className="flex">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            <span>Uploading</span>
          </div>
        ) : (
          'Get File URL'
        )}
      </Button>

      {uploadedFileURL && (
        <Alert>
          <Link2Icon className="h-4 w-4" />
          <AlertTitle>Your File URL &darr;</AlertTitle>
          <AlertDescription>{uploadedFileURL}</AlertDescription>
          <div className="flex justify-end w-full mt-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(uploadedFileURL);
                handleCopied();
              }}
              type="button"
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : 'Copy'}
            </Button>
          </div>
        </Alert>
      )}
    </form>
  );
}
