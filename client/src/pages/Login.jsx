import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login({ email, password });
      toast.success('Successfully logged in');
      navigate('/');
    } else {
      toast.error('Please enter credentials');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side: Beautiful Blue Gradient & Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-12 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center space-x-3"
        >
          <Truck className="h-10 w-10 text-white" />
          <span className="text-3xl font-bold tracking-tight">TransitOps</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 max-w-lg"
        >
          <h1 className="text-5xl font-extrabold leading-tight">
            Smart Transport Operations Platform
          </h1>
          <p className="text-lg text-blue-100 opacity-90">
            Manage your fleet, drivers, and trips all in one place with real-time analytics and predictive maintenance tracking.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm text-blue-200"
        >
          &copy; {new Date().getFullYear()} TransitOps Inc. All rights reserved.
        </motion.div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="admin@transitops.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none text-foreground">Password</label>
                  <a href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
            </div>

            <Button className="w-full h-12 text-md" type="submit">
              Sign In to TransitOps
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-primary hover:underline">
              Contact Administrator
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
