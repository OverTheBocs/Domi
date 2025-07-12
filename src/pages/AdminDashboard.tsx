import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Users, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  user_type: string;
  approved: boolean;
  created_at: string;
  password_hash?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ email: '', password: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nome, cognome, email, user_type, approved, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({ title: 'Errore', description: 'Impossibile caricare gli utenti', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ approved: approve })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({ 
        title: approve ? 'Utente approvato' : 'Utente rifiutato', 
        description: `L'utente è stato ${approve ? 'approvato' : 'rifiutato'} con successo` 
      });
      
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Errore', description: 'Impossibile aggiornare lo stato utente', variant: 'destructive' });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({ email: user.email, password: '' });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      const updateData: any = { email: editForm.email };
      if (editForm.password) {
        updateData.password_hash = editForm.password;
      }
      
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', editingUser.id);
      
      if (error) throw error;
      
      toast({ title: 'Successo', description: 'Utente aggiornato con successo' });
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Errore', description: 'Impossibile aggiornare l\'utente', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({ title: 'Successo', description: 'Utente eliminato con successo' });
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Errore', description: 'Impossibile eliminare l\'utente', variant: 'destructive' });
    }
  };

  const pendingUsers = users.filter(user => !user.approved);
  const approvedUsers = users.filter(user => user.approved);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Caricamento...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard Amministratore</h1>
        <p className="text-gray-600">Gestisci utenti e contenuti</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utenti Totali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Attesa</CardTitle>
            <XCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approvati</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedUsers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Utenti in Attesa ({pendingUsers.length})</TabsTrigger>
          <TabsTrigger value="approved">Utenti Approvati ({approvedUsers.length})</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Utenti in Attesa di Approvazione</CardTitle>
              <CardDescription>Approva o rifiuta le nuove registrazioni</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nessun utente in attesa</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.nome} {user.cognome}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.user_type === 'ente' ? 'secondary' : 'default'}>
                            {user.user_type === 'ente' ? 'Ente' : 'Cittadino'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproval(user.id, true)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approva
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleApproval(user.id, false)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Rifiuta
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Utenti Approvati</CardTitle>
              <CardDescription>Lista degli utenti approvati - Modifica email/password</CardDescription>
            </CardHeader>
            <CardContent>
              {approvedUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nessun utente approvato</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.nome} {user.cognome}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.user_type === 'ente' ? 'secondary' : 'default'}>
                            {user.user_type === 'ente' ? 'Ente' : 'Cittadino'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                  <Edit className="w-4 h-4 mr-1" />
                                  Modifica
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Modifica Utente</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input 
                                      id="email" 
                                      value={editForm.email} 
                                      onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="password">Nuova Password (opzionale)</Label>
                                    <Input 
                                      id="password" 
                                      type="password" 
                                      value={editForm.password} 
                                      onChange={(e) => setEditForm({...editForm, password: e.target.value})} 
                                    />
                                  </div>
                                  <Button onClick={handleUpdateUser} className="w-full">
                                    Salva Modifiche
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Elimina
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Feedback</CardTitle>
              <CardDescription>Visualizza e gestisci i feedback degli utenti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Funzionalità feedback in sviluppo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}