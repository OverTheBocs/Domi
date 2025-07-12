import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { FileUpload } from '@/components/FileUpload';

export default function Auth() {
  const [userType, setUserType] = useState('cittadino');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    nome: '', cognome: '', luogoNascita: '', dataNascita: '',
    indirizzo: '', codiceFiscale: '', cellulare: '', email: '', password: '',
    nomeEnte: '', cittaEnte: '', provinciaEnte: '', qualifica: ''
  });
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if admin login
      if (loginData.email === 'antonio.tozzi@bocs.club' && loginData.password === 'Y/OWWD(/NT(&&625wtbahsdgmç§é°ç!') {
        toast({ title: 'Accesso effettuato', description: 'Benvenuto Admin!' });
        navigate('/admin');
        return;
      }
      
      // Use context login function
      const success = await login(loginData.email, loginData.password);
      if (success) {
        navigate('/');
      }
      
    } catch (error: any) {
      toast({ title: 'Errore', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast({ title: 'Errore', description: 'Devi accettare le linee guida', variant: 'destructive' });
      return;
    }

    if (!identityFile) {
      toast({ title: 'Errore', description: 'Carica il documento di identità', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert file to base64 for transmission
      const fileBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(identityFile);
      });

      const { data, error } = await supabase.functions.invoke('register-user', {
        body: { 
          ...registerData, 
          userType,
          identityDocument: {
            name: identityFile.name,
            data: fileBase64
          }
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Successo!', description: data?.message || 'Registrazione completata!' });
      
      // Reset form
      setRegisterData({
        nome: '', cognome: '', luogoNascita: '', dataNascita: '',
        indirizzo: '', codiceFiscale: '', cellulare: '', email: '', password: '',
        nomeEnte: '', cittaEnte: '', provinciaEnte: '', qualifica: ''
      });
      setIdentityFile(null);
      setTermsAccepted(false);
      
    } catch (error: any) {
      toast({ title: 'Errore', description: error.message || 'Errore durante la registrazione', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />Torna alla Home
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Accesso</TabsTrigger>
              <TabsTrigger value="register">Registrazione</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Accedi</CardTitle>
                  <CardDescription>Inserisci le tue credenziali per accedere</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Accesso...' : 'Accedi'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Registrazione</CardTitle>
                  <CardDescription>Crea un nuovo account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label>Tipologia di Registrazione</Label>
                      <RadioGroup value={userType} onValueChange={setUserType}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cittadino" id="cittadino" />
                          <Label htmlFor="cittadino">Cittadino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ente" id="ente" />
                          <Label htmlFor="ente">Ente del Terzo Settore</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div><Label htmlFor="nome">Nome *</Label><Input id="nome" value={registerData.nome} onChange={(e) => setRegisterData({...registerData, nome: e.target.value})} required /></div>
                      <div><Label htmlFor="cognome">Cognome *</Label><Input id="cognome" value={registerData.cognome} onChange={(e) => setRegisterData({...registerData, cognome: e.target.value})} required /></div>
                    </div>

                    <FileUpload 
                      label="Documento di Identità"
                      onFileSelect={setIdentityFile}
                      selectedFile={identityFile}
                      accept="image/*,.pdf"
                      required
                    />

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" checked={termsAccepted} onCheckedChange={setTermsAccepted} required />
                      <Label htmlFor="terms" className="text-sm">Acconsento alle linee guida</Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Registrazione...' : 'Registrati'}
                    </Button>
                    
                    <p className="text-sm text-gray-600 text-center">La registrazione sarà soggetta ad approvazione.</p>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}