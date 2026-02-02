import React, { useState } from 'react';
import { reasoningOrchestrator } from '@/functions/reasoningOrchestrator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function KaiChat() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState([]);

    const handleQuery = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMessage = { sender: 'user', text: query };
        setConversation(prev => [...prev, userMessage]);
        setIsLoading(true);
        setQuery('');

        try {
            const { data, error } = await reasoningOrchestrator({ query });
            if (error) throw new Error(error.message || 'An unknown error occurred');
            
            const kaiMessage = { sender: 'kai', text: data.response };
            setConversation(prev => [...prev, kaiMessage]);

        } catch (err) {
            console.error(err);
            const errorMessage = { sender: 'kai', text: `I encountered an error: ${err.message}` };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-black/20 backdrop-blur-md border border-[var(--kai-border-color)] h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-300"><Bot /> Talk to Kai</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-4">
                <ScrollArea className="flex-grow h-64 mb-4 pr-3">
                    <div className="space-y-4">
                        {conversation.length === 0 && (
                            <div className="flex items-center justify-center h-full text-gray-500">Ask Kai anything...</div>
                        )}
                        {conversation.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg animate-fade-in ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800/50'}`}>
                                    <ReactMarkdown className="prose dark:prose-invert prose-sm break-words">{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                 <div className="p-3 rounded-lg bg-gray-800/50">
                                    <Loader2 className="animate-spin h-5 w-5 text-cyan-400" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <form onSubmit={handleQuery} className="flex gap-2 border-t border-[var(--kai-border-color)] pt-4">
                    <Input 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="What's on your mind?"
                        disabled={isLoading}
                        className="bg-transparent border-white/20 focus:border-cyan-400"
                    />
                    <Button type="submit" disabled={isLoading} variant="outline" className="bg-cyan-500/20 border-cyan-500 hover:bg-cyan-500/40 text-cyan-300">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}