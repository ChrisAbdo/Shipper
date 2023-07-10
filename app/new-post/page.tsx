import React from 'react';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

import { prisma } from '@/prisma/db';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import UploadForm from '@/components/upload';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  async function addPost(formData: FormData) {
    'use server';
    const demoURL = String(formData.get('demoURL'));
    const title = String(formData.get('title'));
    const description = String(formData.get('description'));
    const authorId = session?.user.id;
    await prisma.post.create({
      data: {
        demoURL,
        title,
        description,
        authorId,
      },
    });
    redirect('/');
  }

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <form action={addPost}>
            <div className="space-y-12">
              <div className="border-b pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <Label htmlFor="demoURL" id="demoURL">
                      Demo Video URL<span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2">
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          type="text"
                          id="demoURL"
                          name="demoURL"
                          autoComplete="off"
                          placeholder="Click the button to upload a file and generate a URL using Vercel Blob. Then paste that in here!"
                        />
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="secondary" className="flex">
                              Generate&nbsp;
                              <span>URL</span>
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <UploadForm />
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <Label htmlFor="title" id="title">
                      Title<span className="text-red-500">*</span>
                    </Label>

                    <div className="mt-2">
                      <Input
                        required
                        id="title"
                        name="title"
                        placeholder="This should be a short title for your project."
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <Label htmlFor="description" id="description">
                      Description<span className="text-red-500">*</span>
                    </Label>

                    <div className="mt-2">
                      <Textarea
                        required
                        id="description"
                        rows={10}
                        name="description"
                        placeholder="This should be a short description for your project. Explain what it does, how it works, and why you made it."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
