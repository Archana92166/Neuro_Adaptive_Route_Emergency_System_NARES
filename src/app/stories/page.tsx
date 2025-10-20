
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, UserPlus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const placeholderStories = [
    {
        author: "Emily R.",
        avatar: "https://placehold.co/100x100.png",
        initials: "ER",
        title: "Finding My Quiet Path Through the City",
        excerpt: "For years, my commute was a source of constant anxiety. The noise, the crowds... it was all too much. NeuroNav changed everything. Finding a route that skirted the main avenues was a revelation. It takes a few minutes longer, but I arrive calm and centered. It's not just an app; it's a tool for peace of mind.",
        image: "https://placehold.co/600x400.png",
        imageHint: "quiet city street"
    },
    {
        author: "Leo G.",
        avatar: "https://placehold.co/100x100.png",
        initials: "LG",
        title: "How Sensory Matching Helped Me Focus",
        excerpt: "I've always struggled with focus, especially with visual distractions. The Sensory Matching game seemed simple at first, but it's been surprisingly effective. It's like a workout for my brain. I've noticed a real difference in my ability to tune out distractions during my studies. Highly recommend giving it a try!",
        image: "https://placehold.co/600x400.png",
        imageHint: "student focusing library"
    },
     {
        author: "Aisha K.",
        avatar: "https://placehold.co/100x100.png",
        initials: "AK",
        title: "An Unexpected Trip to the Clinic",
        excerpt: "I had a minor accident while out and was completely disoriented. I remembered the 'First Aid & Nearby Care' feature. In two taps, I found a clinic just a few blocks away and was able to navigate there directly. In a moment of panic, this app was a lifeline. I'm so grateful for the peace of mind it provides.",
        image: "https://placehold.co/600x400.png",
        imageHint: "calm clinic waiting room"
    }
]


export default function StoriesPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
       <AppHeader
        isSensoryMode={isSensoryMode}
        onSensoryModeChange={setIsSensoryMode}
      />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Peer Stories</h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
                Read inspiring stories from members of the NeuroNav community. Discover how they use the app to navigate the world with greater comfort and confidence.
            </p>
            <Button size="lg" className="mt-6">
                <MessageSquare className="mr-2"/> Share Your Story
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {placeholderStories.map((story, index) => (
                <Card key={index} className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                             <Avatar>
                                <AvatarImage src={story.avatar} alt={story.author} data-ai-hint="person portrait" />
                                <AvatarFallback>{story.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{story.title}</CardTitle>
                                <CardDescription>by {story.author}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                     <CardContent className="flex-grow space-y-4">
                        <div className="aspect-video relative w-full rounded-lg overflow-hidden">
                           <Image src={story.image} alt={story.title} fill objectFit="cover" data-ai-hint={story.imageHint} />
                        </div>
                        <p className="text-muted-foreground text-sm">{story.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center text-muted-foreground">
                       <div className="flex gap-4">
                           <button className="flex items-center gap-1 hover:text-primary"><ThumbsUp size={16}/> 12</button>
                           <button className="flex items-center gap-1 hover:text-primary"><MessageSquare size={16}/> 3</button>
                       </div>
                       <span className="text-xs">Posted 2 days ago</span>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
