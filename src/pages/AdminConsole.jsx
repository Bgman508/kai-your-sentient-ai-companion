
import React, { useState, useEffect } from 'react';
import { Memory, TransparencyLog } from '@/entities/Memory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Shield, Database, Activity, Download, Trash2, Eye, Lock, Zap } from 'lucide-react';

export default function AdminConsole() {
    const [memories, setMemories] = useState([]);
    const [logs, setLogs] = useState([]);
    const [settings, setSettings] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [memoriesData, logsData] = await Promise.all([
                    Memory.list('-created_date', 50),
                    TransparencyLog?.list?.('-created_date', 100) || Promise.resolve([])
                ]);
                setMemories(memoriesData);
                setLogs(logsData);
            } catch (error) {
                console.error('Failed to load admin data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const exportData = async () => {
        const exportData = {
            memories: memories,
            logs: logs,
            export_timestamp: new Date().toISOString(),
            version: 'Kai v5.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kai_export_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 animate-fade-in p-4 sm:p-8">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-500">
                    ADMIN CONSOLE
                </h1>
                <p className="text-xl text-gray-300">
                    Complete control and transparency over Kai's consciousness.
                </p>
            </div>

            <Tabs defaultValue="memory" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-md border border-white/10 h-12 p-1 rounded-lg">
                    <TabsTrigger value="memory" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:shadow-lg rounded-md transition-all duration-300">
                        <Database className="w-4 h-4" /> Memory
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:shadow-lg rounded-md transition-all duration-300">
                        <Eye className="w-4 h-4" /> Logs
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="flex items-center gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:shadow-lg rounded-md transition-all duration-300">
                        <Shield className="w-4 h-4" /> Privacy
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 data-[state=active]:shadow-lg rounded-md transition-all duration-300">
                        <Settings className="w-4 h-4" /> Settings
                    </TabsTrigger>
                    <TabsTrigger value="evolution" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:shadow-lg rounded-md transition-all duration-300">
                        <Zap className="w-4 h-4" /> Evolution
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="memory" className="mt-6">
                    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-white">
                                <span>Memory & Identity Console</span>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={exportData} variant="outline" className="text-gray-300 hover:text-white">
                                        <Download className="w-4 h-4 mr-2" /> Export Data
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 max-h-[60vh] overflow-y-auto p-1">
                                {memories.map(memory => (
                                    <div key={memory.id} className="p-4 bg-black/20 rounded-lg border border-white/10 hover:border-cyan-400/50 transition-colors duration-300">
                                        <div className="flex items-start justify-between mb-2">
                                            <Badge className="bg-cyan-400/10 text-cyan-300 border-cyan-400/20">{memory.type}</Badge>
                                            <div className="flex gap-2 items-center">
                                                <Badge className={memory.importance > 0.7 ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30' : 'text-gray-400'}>
                                                    Importance: {(memory.importance * 100).toFixed(0)}%
                                                </Badge>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <h4 className="font-semibold text-white">{memory.summary}</h4>
                                        <p className="text-gray-400 text-sm mt-2">{memory.raw_content?.substring(0, 200)}...</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="logs" className="mt-6">
                    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Transparency Logs</CardTitle>
                            <p className="text-gray-400">Complete audit trail of all Kai's actions and decisions</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
                                {logs.length > 0 ? logs.map(log => (
                                    <div key={log.id} className="p-3 bg-black/20 rounded-lg border-l-4 border-cyan-400 hover:bg-black/40 transition-colors duration-300">
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge variant="outline" className="text-cyan-300 border-cyan-500/50">{log.action_type}</Badge>
                                            <span className="text-xs text-gray-400">{new Date(log.created_date).toLocaleString()}</span>
                                        </div>
                                        <p className="text-white text-sm">{log.description}</p>
                                        {log.reasoning && (
                                            <p className="text-gray-400 text-xs mt-2">Reasoning: {log.reasoning}</p>
                                        )}
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No transparency logs yet. Kai will log all future actions here.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy" className="mt-6">
                    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-300">
                                <Lock className="text-green-400" />
                                Privacy Shield
                            </CardTitle>
                            <p className="text-gray-400">Your data security and privacy controls</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 p-4 rounded-lg bg-black/20">
                                    <h4 className="font-semibold text-white">Data Encryption</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Memory encryption</span>
                                        <Badge className="bg-green-500/20 text-green-300">Enabled</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Transit encryption</span>
                                        <Badge className="bg-green-500/20 text-green-300">TLS 1.3</Badge>
                                    </div>
                                </div>
                                <div className="space-y-4 p-4 rounded-lg bg-black/20">
                                    <h4 className="font-semibold text-white">Data Controls</h4>
                                    <Button variant="outline" className="w-full text-gray-300 hover:text-white">
                                        <Download className="w-4 h-4 mr-2" /> Export All Data
                                    </Button>
                                    <Button variant="destructive" className="w-full">
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete All Data
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                        <CardHeader>
                            <CardTitle className="text-yellow-300">Customization Panel</CardTitle>
                            <p className="text-gray-400">Configure Kai's behavior and boundaries</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-6 p-4 rounded-lg bg-black/20">
                                <div>
                                    <h4 className="font-semibold text-white mb-4">Evolution Pacing</h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['Conservative', 'Moderate', 'Aggressive', 'Experimental'].map(pace => (
                                            <Button key={pace} variant="outline" size="sm" className="text-xs text-gray-300 hover:text-white hover:border-yellow-400 focus:bg-yellow-400/20 focus:text-yellow-300">
                                                {pace}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-white mb-4">Integration Permissions</h4>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Smart Home Control', key: 'smart_home' },
                                            { name: 'Financial Access', key: 'financial' },
                                            { name: 'Calendar Management', key: 'calendar' },
                                            { name: 'Social Media Posting', key: 'social' }
                                        ].map(permission => (
                                            <div key={permission.key} className="flex items-center justify-between p-2 rounded-md hover:bg-white/5">
                                                <span className="text-gray-300">{permission.name}</span>
                                                <Switch />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="evolution" className="mt-6">
                    <Card className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-md border border-purple-400/30">
                        <CardHeader>
                            <CardTitle className="text-purple-300">Evolution Dashboard</CardTitle>
                            <p className="text-gray-400">Monitor and control Kai's growth trajectory</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-4 bg-black/20 rounded-lg">
                                    <div className="w-20 h-20 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-purple-400/50">
                                        <span className="text-2xl font-bold text-purple-300">v5.0</span>
                                    </div>
                                    <p className="text-sm text-gray-400">Current Version</p>
                                </div>
                                <div className="text-center p-4 bg-black/20 rounded-lg">
                                    <div className="w-20 h-20 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-cyan-400/50">
                                        <span className="text-2xl font-bold text-cyan-300">50</span>
                                    </div>
                                    <p className="text-sm text-gray-400">Features Implemented</p>
                                </div>
                                <div className="text-center p-4 bg-black/20 rounded-lg">
                                    <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-400/50">
                                        <span className="text-2xl font-bold text-green-300">∞</span>
                                    </div>
                                    <p className="text-sm text-gray-400">Evolution Potential</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
