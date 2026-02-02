
import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserIcon, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        dob: '',
        timezone: '',
        preferences: {
            tone: 'casual',
            autonomy_level: 'suggestive'
        }
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                setProfile({
                    full_name: currentUser.full_name || '',
                    email: currentUser.email || '',
                    dob: currentUser.dob ? new Date(currentUser.dob).toISOString().split('T')[0] : '',
                    timezone: currentUser.timezone || '',
                    preferences: currentUser.preferences || { tone: 'casual', autonomy_level: 'suggestive' }
                });
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(p => ({ ...p, [name]: value }));
    };

    const handlePrefChange = (name, value) => {
        setProfile(p => ({ ...p, preferences: { ...p.preferences, [name]: value } }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        const { full_name, dob, timezone, preferences } = profile;
        try {
            await User.updateMyUserData({ full_name, dob, timezone, preferences });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Failed to save profile", error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black animate-fade-in text-white text-center text-lg">
                <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black animate-fade-in">
            <h1 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-4">
                <UserIcon size={48} className="animate-pulse text-cyan-400" /> User Profile
            </h1>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 text-white w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-white">Your Information</CardTitle>
                    <p className="text-gray-400">This information helps Kai understand and align with you.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
                            <Input id="full_name" name="full_name" value={profile.full_name} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input id="email" name="email" value={profile.email} disabled className="bg-white/5 border-white/10 text-gray-400 cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob" className="text-gray-300">Date of Birth</Label>
                            <Input id="dob" name="dob" type="date" value={profile.dob} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white focus:border-cyan-400" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timezone" className="text-gray-300">Timezone</Label>
                            <Input id="timezone" name="timezone" value={profile.timezone} onChange={handleInputChange} placeholder="e.g., America/New_York" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400" />
                        </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <h3 className="text-lg font-medium text-white">Kai's Preferences</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Tone</Label>
                                <Select value={profile.preferences.tone} onValueChange={v => handlePrefChange('tone', v)}>
                                    <SelectTrigger className="bg-white/10 border-white/20 text-white [&>span]:text-white focus:border-cyan-400">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900/80 backdrop-blur-md border-gray-700 text-white">
                                        <SelectItem value="casual" className="hover:bg-cyan-500/20 focus:bg-cyan-500/20">Casual</SelectItem>
                                        <SelectItem value="formal" className="hover:bg-cyan-500/20 focus:bg-cyan-500/20">Formal</SelectItem>
                                        <SelectItem value="empathetic" className="hover:bg-cyan-500/20 focus:bg-cyan-500/20">Empathetic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Autonomy Level</Label>
                                <Select value={profile.preferences.autonomy_level} onValueChange={v => handlePrefChange('autonomy_level', v)}>
                                    <SelectTrigger className="bg-white/10 border-white/20 text-white [&>span]:text-white focus:border-cyan-400">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900/80 backdrop-blur-md border-gray-700 text-white">
                                        <SelectItem value="passive" className="hover:bg-cyan-500/20 focus:bg-cyan-500/20">Passive (Waits for command)</SelectItem>
                                        <SelectItem value="suggestive" className="hover:bg-cyan-500/20 focus:bg-cyan-500/20">Suggestive (Offers ideas)</SelectItem>
                                        <SelectItem value="proactive" className="hover:bg-cyan-500/20 focus:bg-cyan-500/20">Proactive (Takes initiative)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t border-white/10 pt-6">
                    <Button onClick={handleSave} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white transition-colors duration-200">
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
