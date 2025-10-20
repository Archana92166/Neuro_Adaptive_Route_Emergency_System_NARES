
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb, Brain, Map } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const allArticles = [
    {
        slug: "/tips/calmer-commute",
        category: "Navigating Spaces",
        icon: Map,
        color: "text-blue-500",
        title: "5 Tips for a Calmer Commute",
        excerpt: "Learn how to prepare for your daily commute to minimize sensory triggers and arrive at your destination feeling centered.",
        image: "https://placehold.co/600x400.png",
        imageHint: "calm public transport",
    },
    {
        slug: "#",
        category: "Cognitive Skills",
        icon: Brain,
        color: "text-purple-500",
        title: "Improving Focus with Mini-Games",
        excerpt: "Discover how short, daily cognitive exercises can lead to long-term improvements in focus and attention.",
        image: "https://placehold.co/600x400.png",
        imageHint: "person playing brain game",
    },
    {
        slug: "#",
        category: "Sensory Management",
        icon: Lightbulb,
        color: "text-yellow-500",
        title: "Creating a Sensory-Friendly Workspace",
        excerpt: "Simple adjustments to your desk and office environment can make a world of difference for productivity and comfort.",
        image: "https://placehold.co/600x400.png",
        imageHint: "calm office workspace",
    },
    {
        slug: "#",
        category: "Navigating Spaces",
        icon: Map,
        color: "text-blue-500",
        title: "Tips for Grocery Shopping Overload",
        excerpt: "Strategies for navigating the bright lights, sounds, and crowds of a supermarket.",
        image: "https://placehold.co/600x400.png",
        imageHint: "quiet grocery aisle",
    },
     {
        slug: "#",
        category: "Cognitive Skills",
        icon: Brain,
        color: "text-purple-500",
        title: "The Power of Rhythm in Daily Routines",
        excerpt: "Explore how games like Rhythm & Flow can help establish and maintain daily routines with greater ease.",
        image: "https://placehold.co/600x400.png",
        imageHint: "person enjoying music",
    },
     {
        slug: "#",
        category: "Sensory Management",
        icon: Lightbulb,
        color: "text-yellow-500",
        title: "Your Personal Sensory Toolkit",
        excerpt: "A guide to building a small kit of items (like headphones, sunglasses, or fidgets) to help you manage sensory input on the go.",
        image: "https://placehold.co/600x400.png",
        imageHint: "sensory toolkit items",
    },
    {
        slug: "#",
        category: "Navigating Spaces",
        icon: Map,
        color: "text-blue-500",
        title: "Making Social Gatherings More Comfortable",
        excerpt: "Techniques for conserving energy and finding comfort during parties, events, and other social situations.",
        image: "https://placehold.co/600x400.png",
        imageHint: "quiet conversation corner",
    },
    {
        slug: "#",
        category: "Cognitive Skills",
        icon: Brain,
        color: "text-purple-500",
        title: "Breaking Down Large Tasks",
        excerpt: "Learn the 'chunking' method to make big projects feel less overwhelming and more achievable.",
        image: "https://placehold.co/600x400.png",
        imageHint: "sticky notes on wall",
    },
    {
        slug: "#",
        category: "Sensory Management",
        icon: Lightbulb,
        color: "text-yellow-500",
        title: "Understanding and Managing Meltdowns",
        excerpt: "Identifying triggers and developing strategies for de-escalation and recovery.",
        image: "https://placehold.co/600x400.png",
        imageHint: "calm peaceful landscape",
    },
    {
        slug: "#",
        category: "Navigating Spaces",
        icon: Map,
        color: "text-blue-500",
        title: "A Guide to Neuro-Friendly Restaurants",
        excerpt: "How to find and request accommodations for a more enjoyable dining experience.",
        image: "https://placehold.co/600x400.png",
        imageHint: "quiet restaurant booth",
    },
    {
        slug: "#",
        category: "Cognitive Skills",
        icon: Brain,
        color: "text-purple-500",
        title: "Using Visual Timers for Time Management",
        excerpt: "How visual aids can help with time perception and staying on track with daily tasks.",
        image: "https://placehold.co/600x400.png",
        imageHint: "visual timer on desk",
    },
    {
        slug: "#",
        category: "Sensory Management",
        icon: Lightbulb,
        color: "text-yellow-500",
        title: "The Benefits of a 'Sensory Diet'",
        excerpt: "Learn how to schedule sensory activities throughout your day to stay regulated and balanced.",
        image: "https://placehold.co/600x400.png",
        imageHint: "person on a swing",
    },
    {
        slug: "#",
        category: "Navigating Spaces",
        icon: Map,
        color: "text-blue-500",
        title: "Traveling by Air: A Sensory Guide",
        excerpt: "From security to boarding, tips to make the airport experience less stressful.",
        image: "https://placehold.co/600x400.png",
        imageHint: "looking out airplane window",
    },
    {
        slug: "#",
        category: "Cognitive Skills",
        icon: Brain,
        color: "text-purple-500",
        title: "Mindfulness for a Busy Mind",
        excerpt: "Simple mindfulness exercises designed for those who struggle with traditional meditation.",
        image: "https://placehold.co/600x400.png",
        imageHint: "person walking in nature",
    },
    {
        slug: "#",
        category: "Sensory Management",
        icon: Lightbulb,
        color: "text-yellow-500",
        title: "Clothing for Comfort and Confidence",
        excerpt: "How to choose fabrics, styles, and tagless options to avoid sensory irritation.",
        image: "https://placehold.co/600x400.png",
        imageHint: "soft comfortable fabrics",
    },
    {
        slug: "#",
        category: "Navigating Spaces",
        icon: Map,
        color: "text-blue-500",
        title: "First Day at a New School or Job",
        excerpt: "Strategies for managing anxiety and making a positive start in a new environment.",
        image: "https://placehold.co/600x400.png",
        imageHint: "welcoming office lobby",
    },
    {
        slug: "#",
        category: "Cognitive Skills",
        icon: Brain,
        color: "text-purple-500",
        title: "Harnessing Hyperfocus for Productivity",
        excerpt: "How to lean into your strengths and use hyperfocus to your advantage.",
        image: "https://placehold.co/600x400.png",
        imageHint: "artist focused on painting",
    },
    {
        slug: "#",
        category: "Sensory Management",
        icon: Lightbulb,
        color: "text-yellow-500",
        title: "Decoding Body Language in Social Situations",
        excerpt: "A guide to understanding non-verbal cues to make social interactions less confusing.",
        image: "https://placehold.co/600x400.png",
        imageHint: "people talking cafe",
    },
    {
        slug: "#",
        category: "Navigating Spaces",
        icon: Map,
        color: "text-blue-500",
        title: "Finding Quiet Spots in Busy Cities",
        excerpt: "Tips for locating parks, libraries, and other urban oases for a quick sensory break.",
        image: "https://placehold.co/600x400.png",
        imageHint: "quiet park bench city",
    },
    {
        slug: "#",
        category: "Cognitive Skills",
        icon: Brain,
        color: "text-purple-500",
        title: "How to Advocate for Your Needs",
        excerpt: "Scripts and strategies for communicating your needs effectively at school, work, and with friends.",
        image: "https://placehold.co/600x400.png",
        imageHint: "confident person speaking",
    },
    {
        slug: "#",
        category: "Sensory Management",
        icon: Lightbulb,
        color: "text-yellow-500",
        title: "Managing Auditory Processing Challenges",
        excerpt: "Tips for filtering background noise and improving comprehension in conversations.",
        image: "https://placehold.co/600x400.png",
        imageHint: "person wearing headphones",
    }
];

const categories = ["All", ...Array.from(new Set(allArticles.map(a => a.category)))];

export default function TipsPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredArticles = selectedCategory === "All"
        ? allArticles
        : allArticles.filter(article => article.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <AppHeader
        isSensoryMode={isSensoryMode}
        onSensoryModeChange={setIsSensoryMode}
      />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
            <div className="inline-block p-4 bg-primary/20 rounded-full mb-4">
                <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Tips & Guides</h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
                A curated collection of articles and resources to help you navigate daily life with more comfort and confidence.
            </p>
             <div className="flex justify-center flex-wrap gap-2 mt-8">
                {categories.map(category => (
                    <Button 
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                    <Link key={index} href={article.slug} className="block group">
                        <Card className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-full">
                            <div className="aspect-video relative w-full">
                                <Image src={article.image} alt={article.title} fill objectFit="cover" data-ai-hint={article.imageHint} />
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <article.icon className={cn(article.color, "h-5 w-5")} />
                                    <CardDescription>{article.category}</CardDescription>
                                </div>
                                <CardTitle className="text-xl">{article.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground text-sm">{article.excerpt}</p>
                            </CardContent>
                            <CardFooter>
                                <span className="text-primary group-hover:underline">Read More &rarr;</span>
                            </CardFooter>
                        </Card>
                    </Link>
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No articles found in this category.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
