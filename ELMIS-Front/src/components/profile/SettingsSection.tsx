import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings, Lock, Bell, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export function SettingsSection() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    reminders: true
  });

  const handlePasswordUpdate = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    });
  };

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Account deletion process would be initiated here.",
      variant: "destructive"
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-accent" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Change Password</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handlePasswordUpdate}
                className="w-full bg-gradient-primary hover:opacity-90 hover-glow"
              >
                Update Password
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <Separator />

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Notification Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <motion.div
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={() => handleNotificationChange('email')}
              />
            </motion.div>
            
            <motion.div
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div>
                <p className="font-medium">In-App Notifications</p>
                <p className="text-sm text-muted-foreground">Show notifications in the app</p>
              </div>
              <Switch
                checked={notifications.inApp}
                onCheckedChange={() => handleNotificationChange('inApp')}
              />
            </motion.div>
            
            <motion.div
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div>
                <p className="font-medium">Due Date Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminded about due dates</p>
              </div>
              <Switch
                checked={notifications.reminders}
                onCheckedChange={() => handleNotificationChange('reminders')}
              />
            </motion.div>
          </div>
        </motion.div>

        <Separator />

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            <h3 className="font-medium text-destructive">Danger Zone</h3>
          </div>
          
          <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
            <div className="mb-3">
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete your account and remove all your data.
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="destructive" className="hover-glow">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </motion.div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers, including rental history and reviews.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}