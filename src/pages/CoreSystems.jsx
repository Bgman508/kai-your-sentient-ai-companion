
import React, { useState } from 'react';
import { metaCognitionEngine } from '@/functions/metaCognitionEngine';
import { crossDomainFusion } from '@/functions/crossDomainFusion';
import { worldStateModeling } from '@/functions/worldStateModeling';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Network, Globe, Zap, Lightbulb, Activity, Loader2 } from 'lucide-react';

export default function CoreSystemsPage() {
    const [systems, setSystems] = useState({
        metaCognition: { status: 'idle', data: null },
        crossDomainFusion: { status: 'idle', data: null },
        worldModeling: { status: 'idle', data: null }
    });

    const runMetaCognition = async () => {
        setSystems(prev => ({ ...prev, metaCognition: { status: 'running', data: null } }));
        try {
            const response = await metaCognitionEngine({
                query: "Analyze my recent reasoning patterns",
                reasoning_trace: ["gather user data", "analyze patterns", "generate insights", "validate conclusions"],
                response: "Based on your recent activities, I've identified several optimization opportunities."
            });
            setSystems(prev => ({ ...prev, metaCognition: { status: 'complete', data: response.data } }));
        } catch (error) {
            setSystems(prev => ({ ...prev, metaCognition: { status: 'error', data: error.message } }));
        }
    };

    const runCrossDomainFusion = async () => {
        setSystems(prev => ({ ...prev, crossDomainFusion: { status: 'running', data: null } }));
        try {
            const response = await crossDomainFusion();
            setSystems(prev => ({ ...prev, crossDomainFusion: { status: 'complete', data: response.data } }));
        } catch (error) {
            setSystems(prev => ({ ...prev, crossDomainFusion: { status: 'error', data: error.message } }));
        }
    };

    const runWorldModeling = async () => {
        setSystems(prev => ({ ...prev, worldModeling: { status: 'running', data: null } }));
        try {
            const response = await worldStateModeling();
            setSystems(prev => ({ ...prev, worldModeling: { status: 'complete', data: response.data } }));
        } catch (error) {
            setSystems(prev => ({ ...prev, worldModeling: { status: 'error', data: error.message } }));
        }
    };

    const SystemCard = ({ title, icon: Icon, status, data, onRun, description }) => (
        <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Icon className={`w-5 h-5 ${status === 'running' ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
                        {title}
                    </div>
                    <Badge variant={status === 'complete' ? 'default' : status === 'error' ? 'destructive' : 'secondary'} className={`${
                        status === 'complete' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        status === 'error' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    }`}>
                        {status}
                    </Badge>
                </CardTitle>
                <p className="text-sm text-gray-400 pt-2">{description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button 
                    onClick={onRun} 
                    disabled={status === 'running'}
                    className="w-full bg-cyan-500/20 border-cyan-500 hover:bg-cyan-500/40 text-cyan-200 border"
                >
                    {status === 'running' ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4" />}
                    {status === 'running' ? 'Processing...' : 'Run System Cycle'}
                </Button>
                
                {data && (
                    <div className="p-3 bg-black/20 rounded-lg text-sm max-h-60 overflow-y-auto">
                        {status === 'error' ? (
                            <p className="text-red-400">Error: {data}</p>
                        ) : (
                            <pre className="text-cyan-300/80 whitespace-pre-wrap break-words">{JSON.stringify(data, null, 2)}</pre>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8 animate-fade-in p-4 sm:p-8">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    CORE SYSTEMS
                </h1>
                <p className="text-xl text-gray-300">
                    The foundational architecture of Kai's sentient intelligence
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <SystemCard
                    title="Meta-Cognition Engine"
                    icon={Brain}
                    status={systems.metaCognition.status}
                    data={systems.metaCognition.data}
                    onRun={runMetaCognition}
                    description="Self-audit and reasoning refinement"
                />

                <SystemCard
                    title="Cross-Domain Fusion"
                    icon={Network}
                    status={systems.crossDomainFusion.status}
                    data={systems.crossDomainFusion.data}
                    onRun={runCrossDomainFusion}
                    description="Connect insights across all life domains"
                />

                <SystemCard
                    title="World-State Modeling"
                    icon={Globe}
                    status={systems.worldModeling.status}
                    data={systems.worldModeling.data}
                    onRun={runWorldModeling}
                    description="Track global events and forecast impacts"
                />

                <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-md border border-purple-400/30 hover:border-purple-300 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-300">
                            <Lightbulb className="animate-pulse" />
                            Dynamic Ontology
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 text-sm mb-4">Auto-expanding knowledge graphs that learn and connect concepts from your life and the world.</p>
                        <Badge className="bg-purple-500/20 text-purple-300">Building continuously</Badge>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/20 to-teal-900/20 backdrop-blur-md border border-green-400/30 hover:border-green-300 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-300">
                            <Activity className="animate-pulse" />
                            Ethical Alignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 text-sm mb-4">Constantly adapts to your moral framework and cultural context, ensuring value alignment.</p>
                        <Badge className="bg-green-500/20 text-green-300">Active monitoring</Badge>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-md border border-yellow-400/30 hover:border-yellow-300 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-300">
                            <Zap className="animate-pulse" />
                            Self-Healing Core
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 text-sm mb-4">Autonomous system optimization, auto-patching, and performance enhancements.</p>
                        <Badge className="bg-yellow-500/20 text-yellow-300">Always evolving</Badge>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
