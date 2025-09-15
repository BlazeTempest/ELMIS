import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

export function UserInfoCard() {
  const { user } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);

  if (!user) return null;

  const joinDate = user.role === 'admin' ? 'January 2023' : 'June 2023';

  return (
    <Card className="glass-card hover-lift">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">User Information</h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" className="hover-glow btn-press">
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <motion.div
            className="relative"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <Avatar className={`h-24 w-24 transition-all duration-300 ${isHovered ? 'glow-primary' : ''}`}>
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <motion.div
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 cursor-pointer"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Camera className="h-6 w-6 text-white" />
              </motion.div>
            </div>
            <div className={`absolute -inset-1 rounded-full transition-all duration-300 ${isHovered ? 'bg-gradient-primary opacity-75 blur-sm' : 'opacity-0'}`} />
          </motion.div>

          {/* User Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{user.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{user.role}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-accent/20 text-accent'
                }`}>
                  {user.role === 'admin' ? 'Administrator' : 'Library Operator'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                whileHover={{ x: 5 }}
              >
                <Mail className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                whileHover={{ x: 5 }}
              >
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{joinDate}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}