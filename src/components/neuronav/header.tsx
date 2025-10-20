
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Moon, Siren, Sun, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { NeuroNavLogo } from "./icons";
import Link from "next/link";
import { navigationLinks } from "@/lib/navigation-data";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AppHeaderProps {
  isSensoryMode: boolean;
  onSensoryModeChange: (isSensory: boolean) => void;
}

export function AppHeader({ isSensoryMode, onSensoryModeChange }: AppHeaderProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm light">
       <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <NeuroNavLogo className="h-8 w-8" />
            <span className="font-bold text-xl hidden sm:inline-block">NeuroNav</span>
          </Link>
          <nav className="hidden md:flex items-center gap-0">
              {navigationLinks.map((group) => (
                <DropdownMenu key={group.title}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium flex items-center gap-1 px-2">
                      {group.title} <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white text-black light">
                     <DropdownMenuLabel>{group.title}</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                    {group.links.map((link) => (
                      <DropdownMenuItem key={link.label} asChild disabled={link.disabled}>
                        <Link href={link.href}>
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="sensory-mode" className="sr-only">Sensory Mode</Label>
                  <Switch
                    id="sensory-mode"
                    checked={isSensoryMode}
                    onCheckedChange={onSensoryModeChange}
                    aria-label="Toggle sensory-friendly mode"
                  />
                  {isSensoryMode ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle {isSensoryMode ? 'Light' : 'Dark'} Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="icon" onClick={() => router.push('/sos')}>
                    <Siren className="h-5 w-5" />
                    <span className="sr-only">Emergency Assistance</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Emergency Assistance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
             {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                       <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback className={cn("bg-blue-500 text-white")}>{getUserInitials(user.displayName)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white light" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                       <Link href="/dashboard"><UserIcon className="mr-2 h-4 w-4" /><span>Dashboard</span></Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login" passHref>
                <Button variant="outline" size="sm" className="bg-white hover:bg-gray-100 text-black">Login</Button>
              </Link>
              <Link href="/signup" passHref>
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
