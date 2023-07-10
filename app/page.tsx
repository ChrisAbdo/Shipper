import React from 'react';
import { prisma } from '@/prisma/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CameraIcon,
  ChatBubbleIcon,
  DotsHorizontalIcon,
  DrawingPinIcon,
  HeartFilledIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
      Comment: {
        include: {
          author: true,
        },
      },
    },
  });

  async function addComment(formData: FormData) {
    'use server';
    const body = String(formData.get('body'));
    const postId = parseInt(formData.get('postId') as string);
    const authorId = session?.user.id;

    await prisma.comment.create({
      data: {
        body,
        authorId,
        postId,
      },
    });
  }

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none space-y-6">
          {posts.map((post) => (
            <div key={post.id}>
              <Card>
                <CardHeader className="sticky top-0 bg-background/80 backdrop-blur-2xl rounded-xl">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={post.author?.image!} />
                        <AvatarFallback>
                          <CameraIcon />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <h1>{post.author?.name}</h1>
                        <time
                          dateTime={post.createdAt.toISOString()}
                          className="text-muted-foreground"
                        >
                          {new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'full',
                          }).format(post.createdAt)}
                        </time>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <DotsHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-32">
                        <DropdownMenuLabel>Settings</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Image</DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          Placeholder
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>Share</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="flex justify-center">
                  <Image
                    src={post.demoURL}
                    alt={post.title}
                    width={500}
                    height={500}
                    className="w-[500px] h-[500px] object-cover mt-6"
                  />
                </CardContent>
                <Separator />
                <CardFooter>
                  <div className="flex flex-col space-y-6">
                    <div className="mt-4">
                      <span className="font-semibold">{post.author?.name}</span>
                      &nbsp;{post.title}
                    </div>

                    {/* <Link href={`/posts/${post.id}`}>Read More</Link> */}

                    {post.Comment.map((comment) => (
                      <div key={comment.id} className="flex space-x-2">
                        <span className="font-semibold">
                          {comment.author?.name}
                        </span>
                        <span>{comment.body}</span>
                      </div>
                    ))}

                    <div className="flex space-x-2">
                      <Button variant="ghost">
                        <HeartFilledIcon className="mr-2" /> 0 Likes
                      </Button>
                      <Button variant="ghost">
                        <ChatBubbleIcon className="mr-2" /> 0 Comments
                      </Button>
                    </div>

                    {/* map the comments */}
                    {/* {post.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-2">
                        <span className="font-semibold">
                          {comment.author?.name}
                        </span>
                        <span>{comment.body}</span>
                      </div>
                    ))} */}

                    <form action={addComment}>
                      <Input
                        name="body"
                        id="body"
                        placeholder="Add a comment..."
                      />
                      <input type="hidden" name="postId" value={post.id} />
                      <Button type="submit" variant="ghost">
                        Post
                      </Button>
                    </form>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
