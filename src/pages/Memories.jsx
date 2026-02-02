
import React, { useState, useEffect } from 'react';
import { Memory } from '@/entities/Memory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, BrainCircuit, Search } from 'lucide-react';
import { format } from 'date-fns';

function MemoryForm({ onSave }) {
    const [summary, setSummary] = useState('');
    const [rawContent, setRawContent] = useState('');
    const [type, setType] = useState('conversation');
    const [tags, setTags] = useState('');

    const handleSave = async () => {
        if (!summary.trim() || !rawContent.trim()) {
            alert("Summary and content are required.");
            return;
        }
        const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
        await Memory.create({ summary, raw_content: rawContent, type, tags: tagArray, confidence: Math.random() * 0.2 + 0.8 });
        setSummary('');
        setRawContent('');
        setTags('');
        onSave();
    };

    return (
        <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-300">
                    <Plus /> Memorize
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input placeholder="Summary..." className="bg-transparent border-white/20 focus:border-cyan-400" value={summary} onChange={e => setSummary(e.target.value)} />
                <Textarea placeholder="Raw content..." className="bg-transparent border-white/20 focus:border-cyan-400" value={rawContent} onChange={e => setRawContent(e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Tags (comma-separated)..." className="bg-transparent border-white/20 focus:border-cyan-400" value={tags} onChange={e => setTags(e.target.value)} />
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="bg-transparent border-white/20 focus:border-cyan-400"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent className="bg-gray-900/80 backdrop-blur-md border-gray-700 text-white">
                            <SelectItem value="conversation">Conversation</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="bio">Bio</SelectItem>
                            <SelectItem value="preference">Preference</SelectItem>
                            <SelectItem value="emotion">Emotion</SelectItem>
                            <SelectItem value="idea">Idea</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} className="bg-cyan-500/20 border-cyan-500 hover:bg-cyan-500/40 text-cyan-200 border">Store Memory</Button>
            </CardFooter>
        </Card>
    );
}

function MemoryCard({ memory }) {
    return (
        <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
            <CardHeader>
                <CardTitle className="text-lg text-white">{memory.summary}</CardTitle>
                <p className="text-sm text-gray-400">{format(new Date(memory.created_date), 'PPP p')}</p>
            </CardHeader>
            <CardContent>
                <p className="text-gray-300 mb-4">{memory.raw_content}</p>
                <div className="flex items-center justify-between">
                     <Badge variant="secondary" className="bg-cyan-400/10 text-cyan-300 border-cyan-400/20">{memory.type}</Badge>
                     <div className="flex gap-2 flex-wrap">
                        {memory.tags?.map(tag => <Badge key={tag} className="bg-purple-400/10 text-purple-300 border-purple-400/20">{tag}</Badge>)}
                     </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function MemoriesPage() {
    const [memories, setMemories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const loadMemories = async () => {
        const data = await Memory.list('-created_date');
        setMemories(data);
    };

    useEffect(() => {
        loadMemories();
    }, []);

    const filteredMemories = memories.filter(m => 
        m.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.raw_content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="animate-fade-in p-4 sm:p-8">
            <h1 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-4">
                <BrainCircuit size={48} className="animate-pulse text-cyan-400"/> Memory Stream
            </h1>
            <div className="grid lg:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <MemoryForm onSave={loadMemories} />
                </div>
                <div className="space-y-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                            placeholder="Recall a memory..." 
                            className="pl-10 bg-transparent border-white/20 focus:border-cyan-400" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="space-y-4 max-h-[75vh] overflow-y-auto p-1 rounded-lg">
                        {filteredMemories.map(memory => (
                            <MemoryCard key={memory.id} memory={memory} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
