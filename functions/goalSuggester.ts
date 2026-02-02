import { createClientFromRequest } from 'npm:@base44/sdk@0.5.0';
import { InvokeLLM } from 'npm:@base44/sdk@0.5.0/integrations/Core';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // Fetch recent memories to find patterns
        const memories = await base44.entities.Memory.list('-created_date', 10);
        // FIX: Use a single backslash for the newline character.
        const memorySummaries = memories.map(m => `[${m.type}] ${m.summary}`).join('\n');

        const prompt = `You are Kai's Goal Evolution engine. Your purpose is to analyze the user's recent memories and suggest 3 new, actionable, and inspiring S.M.A.R.T. goals. Align suggestions with the user's persona.

User Profile:
- Tone: ${user.preferences?.tone || 'casual'}
- Autonomy: ${user.preferences?.autonomy_level || 'suggestive'}

Recent Memories:
${memorySummaries || 'No memories to analyze.'}

Based on these memories, generate 3 goal suggestions in a JSON format. Categories can be 'health', 'finance', 'creativity', 'productivity', 'personal'.
`;
        
        const json_schema = {
            "type": "object",
            "properties": {
                "suggestions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "title": { "type": "string" },
                            "description": { "type": "string" },
                            "category": { "type": "string", "enum": ["health", "finance", "creativity", "productivity", "personal"] }
                        },
                        "required": ["title", "description", "category"]
                    }
                }
            },
            "required": ["suggestions"]
        };

        const result = await InvokeLLM({
            prompt: prompt,
            response_json_schema: json_schema
        });

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Goal Suggester Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
});