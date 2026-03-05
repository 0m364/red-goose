import { Recipe, ScheduledRecipe } from '../recipe';
import { Message } from '../api';

export interface ChatType {
  sessionId: string;
  name: string;
  messages: Message[];
  recipe?: ScheduledRecipe | null; // Add recipe configuration to chat state
  resolvedRecipe?: Recipe | null; // Add resolved recipe with parameter values rendered to chat state
  recipeParameterValues?: Record<string, string> | null; // Add recipe parameters to chat state
}
