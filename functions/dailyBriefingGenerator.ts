import { createClientFromRequest } from 'npm:@base44/sdk@0.5.0';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        // Return a simple static briefing for now
        const staticBriefing = {
            headline: { 
                title: "Kai is now online and operational", 
                source: "System" 
            },
            fact_of_the_day: "Every journey begins with a single step.",
            quote_of_the_day: { 
                text: "The best way to predict the future is to create it.", 
                author: "Peter Drucker" 
            },
            focus_for_today: "Today, focus on building momentum toward your goals."
        };

        return new Response(JSON.stringify(staticBriefing), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ 
            error: error.message,
            fallback: {
                headline: { title: "System Ready", source: "Kai" },
                fact_of_the_day: "I'm here to help you achieve your goals.",
                quote_of_the_day: { text: "Progress, not perfection.", author: "Kai" },
                focus_for_today: "Let's start with what matters most today."
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});