import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, Database, Network } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SystemMetrics() {
    const [metrics, setMetrics] = useState({
        responseTime: 120,
        memoryUsage: 75,
        cpuLoad: 40,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics({
                responseTime: Math.floor(Math.random() * 50) + 80, // 80-130ms
                memoryUsage: Math.floor(Math.random() * 20) + 65, // 65-85%
                cpuLoad: Math.floor(Math.random() * 30) + 30, // 30-60%
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const MetricItem = ({ icon: Icon, label, value, unit, color, progressValue }) => (
        <div className="flex items-center gap-4">
            <Icon className={`w-6 h-6 ${color}`} />
            <div className="flex-grow">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-gray-300 text-sm">{label}</span>
                    <span className="font-bold text-white">{value}<span className="text-xs text-gray-400 ml-1">{unit}</span></span>
                </div>
                <Progress value={progressValue} className="h-1.5" indicatorClassName={color.replace('text-','bg-')} />
            </div>
        </div>
    );

    return (
        <Card className="bg-black/20 backdrop-blur-md border border-[var(--kai-border-color)] flex-grow">
            <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Activity className="text-green-400 animate-pulse" />
                    System Vitals
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <MetricItem 
                    icon={Zap}
                    label="Response Time"
                    value={metrics.responseTime}
                    unit="ms"
                    color="text-yellow-400"
                    progressValue={(200 - metrics.responseTime) / 1.2}
                />
                <MetricItem 
                    icon={Database}
                    label="Memory Usage"
                    value={metrics.memoryUsage}
                    unit="%"
                    color="text-blue-400"
                    progressValue={metrics.memoryUsage}
                />
                <MetricItem 
                    icon={Network}
                    label="Cognitive Load"
                    value={metrics.cpuLoad}
                    unit="%"
                    color="text-purple-400"
                    progressValue={metrics.cpuLoad}
                />
            </CardContent>
        </Card>
    );
}