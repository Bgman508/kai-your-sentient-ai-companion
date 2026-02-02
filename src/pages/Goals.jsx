
import React, { useState, useEffect } from 'react';
import { Goal } from '@/entities/Goal';
import { goalSuggester } from '@/functions/goalSuggester';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Lightbulb, Check, Plus, Loader2 } from 'lucide-react';

export default function GoalsPage() {
    const [goals, setGoals] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const loadGoals = async () => {
        setIsLoading(true);
        const data = await Goal.list('-created_date');
        setGoals(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadGoals();
    }, []);

    const handleGetSuggestions = async () => {
        setIsSuggesting(true);
        setSuggestions([]);
        try {
            const { data } = await goalSuggester();
            if (data && data.suggestions) {
                setSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error("Failed to get suggestions:", error);
        } finally {
            setIsSuggesting(false);
        }
    };
    
    const handleAcceptSuggestion = async (suggestion) => {
        await Goal.create({
            ...suggestion,
            status: 'active'
        });
        setSuggestions(prev => prev.filter(s => s.title !== suggestion.title));
        loadGoals();
    };

    const GoalCard = ({ goal }) => (
        <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-white">{goal.title}</CardTitle>
                    <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'} className={`${goal.status === 'completed' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'}`}>{goal.status}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-300">{goal.description}</p>
            </CardContent>
             <CardFooter className="flex justify-between">
                <Badge className="bg-purple-400/10 text-purple-300 border-purple-400/20">{goal.category}</Badge>
                {goal.status !== 'completed' && (
                     <Button variant="outline" size="sm" onClick={async () => { await Goal.update(goal.id, { status: 'completed' }); loadGoals();}}>
                        <Check className="mr-2 h-4 w-4" /> Mark as Completed
                    </Button>
                )}
            </CardFooter>
        </Card>
    );

    return (
        <div className="animate-fade-in p-4 sm:p-8">
            <h1 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-4">
                <Target size={48} className="animate-pulse text-cyan-400" /> Goals & Ambitions
            </h1>
            
            <Card className="mb-8 bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-cyan-300"><Lightbulb className="text-yellow-400"/> Goal Suggestions</div>
                        <Button onClick={handleGetSuggestions} disabled={isSuggesting} className="bg-cyan-500/20 border-cyan-500 hover:bg-cyan-500/40 text-cyan-200 border">
                            {isSuggesting ? <Loader2 className="animate-spin" /> : "Generate New Suggestions"}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isSuggesting && <div className="text-center text-gray-400 p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />Kai is thinking...</div>}
                    {!isSuggesting && suggestions.length === 0 && <p className="text-gray-400">Click the button to have Kai suggest goals based on your memories.</p>}
                    <div className="space-y-4">
                        {suggestions.map((s, i) => (
                            <div key={i} className="p-4 border rounded-lg flex items-center justify-between bg-white/5 border-white/10">
                                <div>
                                    <h3 className="font-semibold text-white">{s.title}</h3>
                                    <p className="text-sm text-gray-400">{s.description}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => handleAcceptSuggestion(s)}><Plus className="mr-2 h-4 w-4" /> Accept</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <h2 className="text-3xl font-bold mb-4 text-white">Active Goals</h2>
            {isLoading && <p className="text-gray-400">Loading goals...</p>}
            <div className="space-y-4">
                {goals.filter(g => g.status === 'active').map(goal => <GoalCard key={goal.id} goal={goal} />)}
            </div>

            <h2 className="text-3xl font-bold mb-4 mt-8 text-white">Completed Goals</h2>
            <div className="space-y-4">
                {goals.filter(g => g.status === 'completed').map(goal => <GoalCard key={goal.id} goal={goal} />)}
            </div>
        </div>
    );
}
