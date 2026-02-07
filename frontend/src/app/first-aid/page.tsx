
"use client";

import { AppHeader } from "@/components/neuronav/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookPlus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { NearbyMedicalServices } from "@/components/neuronav/nearby-medical-services";
import { Separator } from "@/components/ui/separator";

const guides = [
  {
    title: "Managing a Panic Attack",
    content: [
      "Find a quiet space if possible.",
      "Focus on your breathing. Inhale slowly for 4 seconds, hold for 4 seconds, and exhale slowly for 6 seconds.",
      "Acknowledge you are having a panic attack and remind yourself it will pass.",
      "Ground yourself by noticing 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    ],
  },
  {
    title: "Handling Sensory Overload",
    content: [
      "Move to a less stimulating environment. Find a quieter, darker, or less crowded area.",
      "Use sensory-blocking tools if you have them, like noise-cancelling headphones or sunglasses.",
      "Engage in a calming, repetitive motion, like rocking or squeezing a stress ball.",
      "Focus on a single object to reduce visual input.",
    ],
  },
  {
    title: "Minor Cuts and Scrapes",
    content: [
      "Wash your hands with soap and water.",
      "Apply gentle pressure with a clean cloth to stop the bleeding.",
      "Clean the wound with water. Avoid using hydrogen peroxide or iodine, which can damage tissue.",
      "Apply an antibiotic ointment and cover the wound with a sterile bandage.",
    ],
  },
    {
    title: "Minor Burns",
    content: [
        "Cool the burn. Hold the area under cool (not cold) running water for about 10 minutes.",
        "Remove rings or other tight items from the burned area.",
        "Do not break blisters. If a blister breaks, gently clean the area with water.",
        "Apply a lotion that contains aloe vera to soothe the skin.",
        "Cover the burn with a sterile gauze bandage (not fluffy cotton).",
    ],
  },
];

export default function FirstAidPage() {
  const [isSensoryMode, setIsSensoryMode] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader
        isSensoryMode={isSensoryMode}
        onSensoryModeChange={setIsSensoryMode}
      />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
                 <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <BookPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <CardTitle className="text-3xl font-headline">First Aid & Nearby Care</CardTitle>
                    <CardDescription>Quick reference and help for common situations. This is not a substitute for professional medical advice.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
             <Alert variant="default" className="border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-200">
                <ShieldCheck className="h-4 w-4 !text-amber-600 dark:!text-amber-400" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                    In a serious emergency, always contact professional medical help immediately.
                </AlertDescription>
            </Alert>
            
            <div>
              <h3 className="text-2xl font-headline mb-4">Nearby Medical Services</h3>
              <NearbyMedicalServices />
            </div>

            <Separator />
            
            <div>
              <h3 className="text-2xl font-headline mb-4">First Aid Guides</h3>
              <Accordion type="single" collapsible className="w-full">
                {guides.map((guide, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg hover:no-underline">
                      {guide.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                          {guide.content.map((step, i) => <li key={i}>{step}</li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
