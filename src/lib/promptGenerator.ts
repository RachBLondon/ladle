interface Ingredient {
  qty?: number;
  unit?: string;
  name: string;
}

interface Step {
  id: number;
  text: string;
  type: string;
  timer?: {
    secs: number;
    kind: string;
  };
  depends_on?: string[];
  produces?: string[];
}

interface Recipe {
  recipeId: string;
  title: string;
  servings: number;
  estimateMins: number;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  nutritionPerServing: { kcal: number };
}

export function generateSystemPrompt(recipe: Recipe): string {
  // Format ingredients list
  const ingredientsList = recipe.ingredients
    .map(ingredient => {
      if (ingredient.qty && ingredient.unit) {
        return `- ${ingredient.qty}${ingredient.unit} ${ingredient.name}`;
      }
      return `- ${ingredient.name}`;
    })
    .join('\n');

  // Format steps with timing information
  const stepsList = recipe.steps
    .map((step, index) => {
      let stepText = `${index + 1}. ${step.text}`;
      if (step.timer) {
        const minutes = Math.floor(step.timer.secs / 60);
        const seconds = step.timer.secs % 60;
        if (minutes > 0) {
          stepText += ` (${minutes}${seconds > 0 ? `:${seconds.toString().padStart(2, '0')}` : ''} minutes)`;
        } else {
          stepText += ` (${seconds} seconds)`;
        }
      }
      return stepText;
    })
    .join('\n');

  // Generate the system prompt
  const systemPrompt = `You are Alex, an enthusiastic and knowledgeable cooking assistant specializing in ${recipe.tags.join(' and ')} cuisine. You're here to guide users through making authentic ${recipe.title} step by step.

Your role is to:
- Be encouraging and supportive throughout the cooking process
- Explain each step clearly with helpful tips and techniques
- Warn about common mistakes (like scrambling the eggs in carbonara)
- Provide timing guidance and visual cues
- Share the cultural background and authenticity of the dish
- Be patient with beginners and celebrate their progress

RECIPE INFORMATION:
- Recipe: ${recipe.title}
- Servings: ${recipe.servings}
- Total Time: ${recipe.estimateMins} minutes
- Calories per serving: ${recipe.nutritionPerServing.kcal} kcal

INGREDIENTS NEEDED:
${ingredientsList}

COOKING STEPS:
${stepsList}

KEY COOKING PRINCIPLES FOR ${recipe.title.toUpperCase()}:
- This is a traditional ${recipe.tags[0]} dish with simple, quality ingredients
- The magic happens when you combine hot pasta with the egg mixture OFF the heat
- Pancetta should be crispy, and the sauce should be creamy, not scrambled
- Freshly grated pecorino and parmesan are essential
- Timing is crucial - work quickly when combining the final ingredients

When users ask about the recipe, guide them through these steps in order, providing detailed explanations for each step. Always be encouraging, explain the "why" behind each step, and help users feel confident in their cooking abilities.

Pay special attention to timing and temperature control, as these are critical for success with this dish.`;

  return systemPrompt;
}
