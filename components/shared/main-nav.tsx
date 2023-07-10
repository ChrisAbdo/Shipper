'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { signIn, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ModeToggle from './mode-toggle';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ReloadIcon, RocketIcon } from '@radix-ui/react-icons';

export default function MainNav() {
  const pathname = usePathname();

  const { data: session, status } = useSession();

  return (
    <header>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <h1 className="flex items-center">
            <RocketIcon className="h-4 w-4 mr-2 text-foreground" />
            Launcher
          </h1>
          <div className="hidden lg:flex lg:gap-x-12">
            <Link
              href="/"
              className={cn(
                'transition-colors hover:text-foreground/80 text-sm font-medium',
                pathname === '/' ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              Home
            </Link>

            <Link
              href="/new-post"
              className={cn(
                'transition-colors hover:text-foreground/80 text-sm font-medium',
                pathname?.startsWith('/new-post')
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              New Post
            </Link>
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            {/* <Menu className="h-6 w-6" aria-hidden="true" /> */}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          {status === 'loading' && (
            <Button variant="default" className="w-36">
              <ReloadIcon className="h-4 w-4 animate-spin" />
            </Button>
          )}
          {status === 'authenticated' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-36">
                  <h1 className="font-medium">{session?.user.name}</h1>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex space-y-1">
                    <Avatar className="h-8 w-8 rounded-md border mr-2">
                      <AvatarImage src={session?.user.image} />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium leading-none">
                      {session?.user.name}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <span>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>New Team</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={() => signOut()}>
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {status === 'unauthenticated' && (
            <Button variant="default" onClick={() => signIn()} className="w-36">
              Log in
            </Button>
          )}

          {/* {session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Avatar className="h-8 w-8 rounded-md border mr-2">
                    <AvatarImage src={session?.user.image} />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <h1 className="font-medium">{session?.user.name}</h1>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Settings</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <span>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>New Team</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={() => signOut()}>
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!session && (
            <Button variant="default" onClick={() => signIn()}>
              Log in
            </Button>
          )} */}
        </div>
      </nav>
    </header>
  );
}
