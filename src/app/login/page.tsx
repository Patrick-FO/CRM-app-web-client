'use client'; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLogin } from "@/presentation/hooks/useLogin";

export default function LoginPage() {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const { login, loading, error, clearError } = useLogin(); 
    const router = useRouter(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        const success = await login(username, password); 
        if(success) {
            router.push('/dashboard'); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
                </CardHeader>
                <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                    </div>
                    
                    <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                
                <div className="mt-4 text-center">
                    <Button variant="link" onClick={() => router.push('/register')}>
                    Don't have an account? Register here
                    </Button>
                </div>
                </CardContent>
            </Card>
        </div>
    );
}