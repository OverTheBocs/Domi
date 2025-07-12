import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

const spaces = [
  'Spazio Open',
  'Spazio Presentazioni',
  'Stanza Colloqui', 
  'Stanza Mezzaluna',
  'Stanza Laboratori',
  'Foresteria',
  'Giardino'
];

interface BookSpaceProps {
  onBack: () => void;
}

const BookSpace: React.FC<BookSpaceProps> = ({ onBack }) => {
  const { isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    activityName: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    selectedSpaces: [] as string[],
    ageGroup: '',
    cost: '',
    restrictions: '',
    link: '',
    description: '',
    responsibleName: '',
    responsiblePhone: '',
    acceptGuidelines: false
  });

  const handleSpaceChange = (space: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedSpaces: checked 
        ? [...prev.selectedSpaces, space]
        : prev.selectedSpaces.filter(s => s !== space)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleRegister = () => {
    navigate('/auth');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna alla Home
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Accesso Richiesto</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Per prenotare uno spazio è necessario essere registrati e approvati.
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 space-y-4">
                <Button className="w-full" onClick={handleLogin}>
                  Accedi
                </Button>
                <Button variant="outline" className="w-full" onClick={handleRegister}>
                  Registrati
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alla Home
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Richiedi uno Spazio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dati Pubblici */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Dati Pubblici dell'Evento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="activityName">Nome Attività *</Label>
                    <Input
                      id="activityName"
                      value={formData.activityName}
                      onChange={(e) => setFormData(prev => ({ ...prev, activityName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Carica Locandina (4:5)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Clicca per caricare</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="startDate">Data Inizio *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="startTime">Ora Inizio *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="endDate">Data Fine *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endTime">Ora Fine *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>Spazi Richiesti *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {spaces.map((space) => (
                      <div key={space} className="flex items-center space-x-2">
                        <Checkbox
                          id={space}
                          checked={formData.selectedSpaces.includes(space)}
                          onCheckedChange={(checked) => handleSpaceChange(space, checked as boolean)}
                        />
                        <Label htmlFor={space} className="text-sm">{space}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Dati Privati */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Dati del Responsabile</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsibleName">Nome e Cognome *</Label>
                    <Input
                      id="responsibleName"
                      value={formData.responsibleName}
                      onChange={(e) => setFormData(prev => ({ ...prev, responsibleName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="responsiblePhone">Numero di Cellulare *</Label>
                    <Input
                      id="responsiblePhone"
                      type="tel"
                      value={formData.responsiblePhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, responsiblePhone: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="guidelines"
                  checked={formData.acceptGuidelines}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptGuidelines: checked as boolean }))}
                  required
                />
                <Label htmlFor="guidelines" className="text-sm">
                  Acconsento alle <a href="#" className="text-blue-600 hover:underline">linee guida</a> per l'uso degli spazi *
                </Label>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Contributo Stimato:</strong> €25,00
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Il contributo finale sarà comunicato dopo l'approvazione della richiesta.
                </p>
              </div>
              
              <Button type="submit" className="w-full">
                Invia Richiesta
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookSpace;