'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRegister } from '@/presentation/hooks/useRegister';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register, loading, error, clearError } = useRegister(); 
    const router = useRouter(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if(password != confirmPassword) {
            return;
        }

        const success = await register(username, password); 
        if(success) {
            router.push('dashboard'); 
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Create a new account to get started
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
                placeholder="Choose a username"
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
                placeholder="Choose a password"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            
            {password !== confirmPassword && confirmPassword && (
              <Alert variant="destructive">
                <AlertDescription>Passwords do not match</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || password !== confirmPassword}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => router.push('/login')}>
              Already have an account? Login here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}