import React, { useState, useEffect } from 'react';
import { dailyBriefingGenerator } from '@/functions/dailyBriefingGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Lightbulb, MessageSquareQuote, Brain, Loader2, AlertTriangle, Sparkles } from 'lucide-react';

export default function DailyBriefing() {
    const [briefing, setBriefing] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBriefing = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const response = await dailyBriefingGenerator();
                
                if (response.data) {
                    const briefingData = response.data.fallback || response.data;
                    setBriefing(briefingData);
                } else {
                    setError("Unable to fetch briefing");
                }
            } catch (err) {
                console.error("Briefing fetch failed:", err);
                setBriefing({
                    headline: { title: "Kai is evolving", source: "System" },
                    fact_of_the_day: "Innovation requires embracing failure as a learning opportunity.",
                    quote_of_the_day: { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
                    focus_for_today: "Focus on progress, not perfection."
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchBriefing();
    }, []);

    if (isLoading) {
        return (
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-md border border-cyan-400/30 h-full">
                <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
                        <p className="text-cyan-300">Analyzing world events...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error && !briefing) {
        return (
            <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-md border border-red-400/30 h-full">
                <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-4" />
                        <p className="text-amber-300">{error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-indigo-900/20 to-cyan-900/20 backdrop-blur-md border border-cyan-400/30 h-full overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                    <Sparkles className="animate-pulse" />
                    Daily Intelligence Briefing
                </CardTitle>
                <Badge variant="outline" className="w-fit border-cyan-400/50 text-cyan-300">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
                {briefing && (
                    <>
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2 text-white">
                                <Newspaper size={18} className="text-blue-400" /> World Pulse
                            </h3>
                            <div className="p-3 bg-white/5 rounded-lg border-l-4 border-blue-400">
                                <p className="text-gray-200 font-medium">{briefing.headline?.title}</p>
                                <p className="text-gray-400 text-sm mt-1">Source: {briefing.headline?.source}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2 text-white">
                                <Brain size={18} className="text-purple-400" /> Knowledge Expansion
                            </h3>
                            <div className="p-3 bg-white/5 rounded-lg border-l-4 border-purple-400">
                                <p className="text-gray-200">{briefing.fact_of_the_day}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2 text-white">
                                <MessageSquareQuote size={18} className="text-green-400" /> Wisdom Feed
                            </h3>
                            <div className="p-3 bg-white/5 rounded-lg border-l-4 border-green-400">
                                <p className="text-gray-200 italic">"{briefing.quote_of_the_day?.text}"</p>
                                <p className="text-gray-400 text-sm mt-2">— {briefing.quote_of_the_day?.author}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2 text-cyan-300">
                                <Lightbulb size={18} className="text-cyan-400 animate-pulse" /> Today's Focus
                            </h3>
                            <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-400/30">
                                <p className="text-cyan-100 font-medium">{briefing.focus_for_today}</p>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}