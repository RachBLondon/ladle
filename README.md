# 🍝 Sous Chef - AI Cooking Assistant

Sous Chef is an AI-powered cooking assistant that helps you learn to cook delicious dishes with step-by-step guidance from Alex, your personal AI chef. Built with Next.js and integrated with Anam AI for interactive video cooking assistance.

## 🚀 Features

- **AI Cooking Assistant**: Chat with Alex, your personal AI chef
- **Step-by-Step Guidance**: Interactive recipe instructions with timing
- **Dynamic Recipe System**: Recipe data-driven prompts for accurate guidance
- **Beautiful UI**: Fresh, cooking-themed design with lime green color scheme
- **Responsive Design**: Works perfectly on desktop and mobile

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Anam AI API key

### Environment Setup

1. **Create Environment File**
   
   Create a `.env.local` file in the root directory of your project:
   
   ```bash
   # Create the environment file
   touch .env.local
   ```

2. **Add Your Anam AI API Key**
   
   Open the `.env.local` file and add your Anam AI API key:
   
   ```env
   ANAM_API_KEY=your_anam_api_key_here
   ```
   
   Replace `your_anam_api_key_here` with your actual Anam AI API key.

3. **File Structure**
   
   Your project structure should look like this:
   ```
   sous_chef/
   ├── .env.local          # ← Your environment file (create this)
   ├── src/
   ├── package.json
   └── README.md
   ```

### Installation & Development

1. **Install Dependencies**
   
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Run the Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. **Open Your Browser**

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Project Structure

```
sous_chef/
├── .env.local                    # Environment variables (create this)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── session-token/    # Anam AI session token API
│   │   ├── page.tsx              # Main landing page
│   │   └── layout.tsx            # App layout
│   ├── data/
│   │   └── recipes/
│   │       └── carbonara.json    # Recipe data
│   └── lib/
│       └── promptGenerator.ts    # Dynamic prompt generation
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANAM_API_KEY` | Your Anam AI API key for the cooking assistant | Yes |

### Recipe System

The app uses a dynamic recipe system where:
- Recipe data is stored in JSON format in `src/data/recipes/`
- System prompts are generated automatically from recipe data
- Currently includes Spaghetti Carbonara as a demo recipe

## 🚀 Usage

1. **Start the app** and navigate to the homepage
2. **Click "Start Cooking with Alex"** to begin your cooking session
3. **View ingredients** in the right panel to see what you need
4. **Switch to steps view** to follow along with cooking instructions
5. **Chat with Alex** for personalized cooking guidance

## 🎨 Design System

The app uses a fresh, cooking-themed color scheme:
- **Primary**: Lime Green (`#84CC16`) - Fresh, energetic
- **Secondary**: Golden Yellow (`#EAB308`) - Warm, appetizing  
- **Accent**: Teal (`#14B8A6`) - Calming, sophisticated
- **Neutrals**: Slate grays for text and backgrounds

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Anam AI Documentation](https://docs.anam.ai) - Learn about Anam AI integration
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important**: Don't forget to add your `ANAM_API_KEY` environment variable in your Vercel deployment settings!

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
