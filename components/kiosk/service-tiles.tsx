'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Droplets, Flame, MapPin, AlertCircle, CreditCard } from 'lucide-react';
import { useKiosk } from '@/lib/kiosk-context';

interface ServiceTilesProps {
  onSelect: (service: string) => void;
}

const services = [
  { id: 'electricity', name: 'Electricity Bill', icon: Zap, color: 'bg-yellow-50 border-yellow-300', description: 'Pay your electricity bills quickly' },
  { id: 'water', name: 'Water Bill', icon: Droplets, color: 'bg-blue-50 border-blue-300', description: 'Manage water supply charges' },
  { id: 'gas', name: 'Gas Bill', icon: Flame, color: 'bg-orange-50 border-orange-300', description: 'Pay gas subscription fees' },
  { id: 'municipal', name: 'Municipal Tax', icon: MapPin, color: 'bg-green-50 border-green-300', description: 'Property tax and civic charges' },
  { id: 'complaint', name: 'Lodge Complaint', icon: AlertCircle, color: 'bg-red-50 border-red-300', description: 'Report service issues' },
  { id: 'bills', name: 'All Payments', icon: CreditCard, color: 'bg-purple-50 border-purple-300', description: 'View & pay all bills' },
];

export default function ServiceTiles({ onSelect }: ServiceTilesProps) {
  const { speak, accessibilityMode } = useKiosk();

  const handleClick = (service: typeof services[0]) => {
    speak(`Opening ${service.name} service`);
    onSelect(service.id);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {services.map(service => {
        const Icon = service.icon;
        return (
          <button
            key={service.id}
            onClick={() => handleClick(service)}
            className="group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            aria-label={service.name}
          >
            <Card className={`h-32 p-6 cursor-pointer hover:shadow-lg transition-all border-2 ${service.color} group-hover:scale-105`}>
              <div className="flex items-center gap-4 h-full">
                <Icon className="w-12 h-12 text-primary shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold text-lg text-foreground">{service.name}</h3>
                  <p className={`text-sm text-muted-foreground ${accessibilityMode === 'deaf' ? 'text-xs' : ''}`}>
                    {service.description}
                  </p>
                </div>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
