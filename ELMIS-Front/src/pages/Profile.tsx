import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { UserInfoCard } from '@/components/profile/UserInfoCard';
import { RentalHistoryCards } from '@/components/profile/RentalHistoryCards';
import { RentalTable } from '@/components/profile/RentalTable';
import { ReviewFeed } from '@/components/profile/ReviewFeed';
import { SettingsSection } from '@/components/profile/SettingsSection';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Profile() {
  return (
    <MainLayout>
      <motion.div
        className="container mx-auto px-4 py-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold gradient-text mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your activity</p>
        </motion.div>

        {/* User Info Card */}
        <motion.div variants={itemVariants}>
          <UserInfoCard />
        </motion.div>

        {/* Rental History Summary */}
        <motion.div variants={itemVariants}>
          <RentalHistoryCards />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Rentals */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <RentalTable />
          </motion.div>

          {/* Review Activity */}
          <motion.div variants={itemVariants}>
            <ReviewFeed />
          </motion.div>

          {/* Settings */}
          <motion.div variants={itemVariants}>
            <SettingsSection />
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
}