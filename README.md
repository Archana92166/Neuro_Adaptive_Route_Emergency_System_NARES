# NeuroNav Application

Welcome to NeuroNav! This guide will walk you through setting up and running your project locally in Visual Studio Code. It's designed to be clear and straightforward to ensure you have a smooth, error-free experience.

## 1. Technology Stack

Your application is built with a modern, powerful set of technologies:

-   **Framework**: [Next.js](https://nextjs.org/) (v15) with the App Router
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [React](https://react.dev/) (v18)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/) - A collection of beautifully designed, accessible components.
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication and Firestore)
-   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (for AI-powered features)
-   **Mapping**: [Google Maps Platform](https://developers.google.com/maps)

---

## 2. Setup and Installation

Follow these steps precisely to get the project running on your local machine.

### Step A: Copy All Project Files

First, ensure you have **all the files and folders** from this project copied into a new folder on your computer. You can name the folder `neuronav-app` or whatever you like.

Open this folder in Visual Studio Code.

### Step B: Create Your Environment File

This is the most critical step to avoid errors. You need to provide your secret API keys in a special file that the application can use.

1.  In the root of your project folder (at the same level as `package.json`), create a new file named `.env.local`.
2.  Copy the following content into your new `.env.local` file:

    ```
    # Firebase Project Credentials
    # Find these in your Firebase project settings:
    # Project Settings > General > Your apps > Firebase SDK snippet > Config
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"

    # Google Maps API Key
    # Find this in your Google Cloud Console. It needs to have Maps JavaScript API & Geocoding API enabled.
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
    ```

3.  **Replace** the placeholder values (like `YOUR_FIREBASE_API_KEY`) with your actual keys from your Firebase and Google Cloud projects.

### Step C: Install Dependencies

Now, open the terminal in VS Code (`View` -> `Terminal` or `Ctrl + \``). Run the following command to download all the necessary packages and modules listed in `package.json`:

```bash
npm install
```

This might take a few minutes.

### Step D: Run the Application

Once the installation is complete, start the local development server by running:

```bash
npm run dev
```

Your NeuroNav application will now be running! You can view it in your browser at [http://localhost:9002](http://localhost:9002).

---

## 3. Project Structure Overview

Here's a guide to the main folders to help you find your way around the code:

-   **/src/app/**: This is the heart of your application, containing all your pages. Each folder inside corresponds to a URL route (e.g., `src/app/login/page.tsx` is the Login page).
-   **/src/components/**: Contains all the reusable UI components.
    -   **/src/components/neuronav/**: Custom components built specifically for this application (like `header.tsx`, `route-form.tsx`).
    -   **/src/components/ui/**: Components from the ShadCN/UI library (like `button.tsx`, `card.tsx`).
-   **/src/lib/**: Contains utility functions, type definitions (`types.ts`), and Firebase configuration (`firebase.ts`).
-   **/src/ai/**: Contains all the backend Generative AI logic, organized into flows and tools using Genkit.
-   **/src/contexts/**: Contains React Context providers, like the `auth-context.tsx` which manages the user's login state globally.
-   **/public/**: For static assets like images or manifest files.
-   **tailwind.config.ts**: The configuration file for all styling and themes.
-   **package.json**: Lists all the external modules and dependencies your project uses.

Everything is set up and ready for you. By following these steps, you will have a perfect, error-free setup in your VS Code environment.
