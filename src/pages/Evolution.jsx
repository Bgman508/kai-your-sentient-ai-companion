
import React, { useState, useEffect } from 'react';
import { UpgradeLog } from '@/entities/UpgradeLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitCommit, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function EvolutionPage() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchLogs = async () => {
            const data = await UpgradeLog.list('-created_date');
            setLogs(data);
            setIsLoading(false);
        };
        fetchLogs();
    }, []);

    return (
        <div className="animate-fade-in p-4 sm:p-8">
            <h1 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center gap-4">
                <Zap size={48} className="animate-pulse text-purple-400" /> Kai's Evolution
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl">
                In line with the principle "Never Downgrade, Always Evolve," this log tracks every upgrade made to Kai's core systems, ensuring transparent and continuous improvement.
            </p>
            {isLoading && <p>Loading evolution history...</p>}
            <div className="space-y-6">
                {logs.map(log => (
                    <Card key={log.id} className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-400/50 transition-colors duration-300">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-3 text-white">
                                <GitCommit className="text-purple-400" />
                                {log.module}: {log.description}
                            </CardTitle>
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{log.version}</Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold mb-2 text-gray-200">Changes in this upgrade:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                {log.changes?.map((change, index) => <li key={index}>{change}</li>)}
                            </ul>
                            <p className="text-xs text-gray-500 mt-4">Deployed on: {format(new Date(log.created_date), 'PPP')}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
