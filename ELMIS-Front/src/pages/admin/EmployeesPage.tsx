import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, UserCheck, UserX, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
// Removed mockEmployees import
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import LoadingOverlay from '@/components/ui/loading-overlay'; // This component is imported but not used.
import UploadButton from '@/components/ui/upload-button'; // This component is imported but not used.
import { ExcelImportModal } from '@/components/ui/excel-import-modal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ExportMenu } from '@/components/ui/export-menu';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OPERATOR';
  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string;
  lastLogin: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'OPERATOR' as 'ADMIN' | 'OPERATOR',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });
  const { toast } = useToast();

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null); // Reset error state on new fetch
      try {
        const response = await axios.get<Employee[]>('/api/employees');
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError('Failed to load employees. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load employees. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(term.toLowerCase()) ||
      emp.email.toLowerCase().includes(term.toLowerCase()) ||
      emp.role.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post<Employee>('/api/employees', {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        // joinDate and lastLogin are typically set by the backend
      });

      setEmployees(prev => [...prev, response.data]);
      setFilteredEmployees(prev => [...prev, response.data]);
      setFormData({ name: '', email: '', role: 'OPERATOR', status: 'ACTIVE' });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
    } catch (err) {
      console.error("Error adding employee:", err);
      toast({
        title: 'Error Adding Employee',
        description: 'There was a problem adding the employee. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async () => {
    if (!formData.name || !formData.email || !editingEmployee) return;

    try {
      const response = await axios.put<Employee>(`/api/employees/${editingEmployee.id}`, {
        id: editingEmployee.id, // Include ID in the payload if the backend expects it
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      });

      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? response.data : emp));
      setFilteredEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? response.data : emp));
      setFormData({ name: '', email: '', role: 'OPERATOR', status: 'ACTIVE' });
      setEditingEmployee(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    } catch (err) {
      console.error("Error updating employee:", err);
      toast({
        title: 'Error Updating Employee',
        description: 'There was a problem updating the employee. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      setFilteredEmployees(prev => prev.filter(emp => emp.id !== id));
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast({
        title: 'Error Deleting Employee',
        description: 'There was a problem deleting the employee. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      status: employee.status,
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' ? (
      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/50">
        <UserCheck className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/50">
        <UserX className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const handleImport = async (importedData: any[]) => {
    setIsLoading(true); // Show loading overlay during import
    try {
      const newEmployees = await Promise.all(importedData.map(async (item) => {
        const response = await axios.post<Employee>('/api/employees', {
          name: item.name || `Imported Employee ${Math.random().toString(36).substring(7)}`,
          email: item.email || `imported${Math.random().toString(36).substring(7)}@library.com`,
          role: (item.role as 'ADMIN' | 'OPERATOR') || 'OPERATOR',
          status: (item.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
        });
        return response.data;
      }));

      setEmployees(prev => [...prev, ...newEmployees]);
      setFilteredEmployees(prev => [...prev, ...newEmployees]);
      toast({
        title: "Success",
        description: `${newEmployees.length} employees imported successfully`,
      });
    } catch (err) {
      console.error("Error importing employees:", err);
      toast({
        title: 'Error Importing Employees',
        description: 'There was a problem importing employees. Please check the data format and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsImportModalOpen(false);
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'ADMIN' ? (
      <Badge variant="default" className="bg-primary/20 text-primary border-primary/50">
        Admin
      </Badge>
    ) : (
      <Badge variant="outline" className="border-muted-foreground/50">
        Operator
      </Badge>
    );
  };

  if (isLoading) {
    return <LoadingSkeleton rows={6} showHeader={true} type="table" />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Employee Management</h1>
          <p className="text-muted-foreground">Manage system users and their permissions</p>
        </div>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="group hover:border-accent/50"
              onClick={() => setIsImportModalOpen(true)}
            >
              <UploadCloud className="h-4 w-4 mr-2 group-hover:text-accent transition-colors" />
              Import Excel
            </Button>
          </motion.div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="group hover:scale-105 transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                  Add Employee
                </Button>
              </motion.div>
            </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur border-primary/20">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Create a new employee account with role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value: 'ADMIN' | 'OPERATOR') => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPERATOR">Operator</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'ACTIVE' | 'INACTIVE') => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add Employee</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Employees</CardTitle>
            <ExportMenu
              fileName="employees"
              getData={() => filteredEmployees}
              mapRow={(e) => ({
                Name: e.name,
                Email: e.email,
                Role: e.role,
                Status: e.status,
                JoinDate: e.joinDate,
              })}
            />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-primary/10">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee, index) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-primary/10 hover:bg-primary/5 transition-colors group"
                  >
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                    <TableCell>{getRoleBadge(employee.role)}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(employee)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:scale-110 transition-transform text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card/95 backdrop-blur border-primary/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {employee.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(employee.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        title="Employees"
        sampleData={[]} // Changed sampleData to empty array as mockEmployees is removed
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card/95 backdrop-blur border-primary/20">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: 'ADMIN' | 'OPERATOR') => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPERATOR">Operator</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'ACTIVE' | 'INACTIVE') => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Update Employee</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
