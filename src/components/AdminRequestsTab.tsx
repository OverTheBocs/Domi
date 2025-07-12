import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle } from 'lucide-react';

interface BookingRequest {
  id: string;
  user_name: string;
  event_title: string;
  participants: number;
  hours: number;
  contribution: number;
  is_free: boolean;
  created_at: string;
}

interface AdminRequestsTabProps {
  requests: BookingRequest[];
}

const AdminRequestsTab: React.FC<AdminRequestsTabProps> = ({ requests }) => {
  const calculateEventCost = (participants: number, hours: number, contribution: number, isFree: boolean) => {
    const baseRate = 0.2;
    const multiplier = isFree ? 1 : contribution * 0.10;
    const cost = participants * hours * baseRate * multiplier;
    return `${participants} (persone) per ${hours} (ore) per ${baseRate} = ${cost.toFixed(2)} per ${multiplier.toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Richieste Spazi</CardTitle>
        <CardDescription>Gestisci le richieste di prenotazione spazi con calcolo costi</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nessuna richiesta</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utente</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Partecipanti</TableHead>
                <TableHead>Ore</TableHead>
                <TableHead>Calcolo Costo</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.user_name}</TableCell>
                  <TableCell>{request.event_title}</TableCell>
                  <TableCell>{request.participants}</TableCell>
                  <TableCell>{request.hours}</TableCell>
                  <TableCell className="text-sm font-mono">
                    {calculateEventCost(request.participants, request.hours, request.contribution, request.is_free)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approva
                      </Button>
                      <Button size="sm" variant="destructive">
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
  );
};

export default AdminRequestsTab;