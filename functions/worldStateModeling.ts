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

        // Simple world state result for now
        const worldResult = {
            world_events: [
                {
                    title: "AI Technology Advancement Accelerating",
                    category: "technology",
                    impact_score: 9,
                    user_relevance: 8,
                    forecast_implications: [
                        "Increased automation in knowledge work",
                        "New opportunities for AI-human collaboration",
                        "Need for continuous learning and adaptation"
                    ],
                    recommended_actions: [
                        "Invest in AI literacy and skills",
                        "Focus on uniquely human capabilities",
                        "Explore AI-assisted productivity tools"
                    ]
                },
                {
                    title: "Remote Work Becoming Permanent Trend",
                    category: "economics",
                    impact_score: 7,
                    user_relevance: 9,
                    forecast_implications: [
                        "Geographic flexibility in career choices",
                        "Home environment becomes critical for productivity",
                        "Digital collaboration skills increasingly valuable"
                    ],
                    recommended_actions: [
                        "Optimize home workspace setup",
                        "Develop strong digital communication skills",
                        "Build distributed team leadership capabilities"
                    ]
                }
            ],
            world_state_summary: "The world is rapidly adapting to technological transformation while restructuring work patterns. This creates both opportunities for personal growth and challenges requiring proactive adaptation.",
            trend_predictions: [
                "AI integration will be essential for career advancement",
                "Physical health will become more important as remote work increases",
                "Creative and emotional intelligence skills will become premium differentiators"
            ]
        };

        return new Response(JSON.stringify(worldResult), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});