'use client';

import { Card } from "@/components/ui/card";
import { mockPatients } from '@/lib/data';
import { Badge } from "@/components/ui/badge";
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subHours } from 'date-fns';
import { Users, Activity, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

export default function Home() {
  // Calculate statistics from mock data
  const totalPatients = mockPatients.length;
  const waitingPatients = mockPatients.filter(p => p.triageLevel === 'level1' || p.triageLevel === 'level2').length;
  const inProgressPatients = mockPatients.filter(p => p.triageLevel === 'level3').length;
  const criticalPatients = mockPatients.filter(p => p.triageLevel === 'level1').length;
  const dischargedPatients = 54;
  
  const averageWaitTime = 40;

  const averageTreatmentTime = 17;

  // Generate hourly arrivals data
  const hourlyArrivals = Array.from({ length: 12 }, (_, i) => {
    const hour = format(subHours(new Date(), i), 'HH:mm');
    return {
      hour,
      patients: Math.floor(Math.random() * 5),
    };
  }).reverse();

  // Generate triage distribution data
  const triageDistribution = [
    { name: 'Immediate', value: mockPatients.filter(p => p.triageLevel === 'level1').length },
    { name: 'Emergency', value: mockPatients.filter(p => p.triageLevel === 'level2').length },
    { name: 'Urgent', value: mockPatients.filter(p => p.triageLevel === 'level3').length },
    { name: 'Semi-urgent', value: mockPatients.filter(p => p.triageLevel === 'level4').length },
    { name: 'Non-urgent', value: mockPatients.filter(p => p.triageLevel === 'level5').length },
  ];

  const getCurrentTime = () => {
    return format(new Date(), 'HH:mm');
  };

  const staffData = {
    onDuty: {
      physicians: 8,
      nurses: 15,
      specialists: 4,
    },
    availability: '85%',
    nextShift: '2h 30m',
  };

  return (
    <div className="h-[calc(100vh-31px)] flex flex-col space-y-4 p-8">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            Last updated: {getCurrentTime()}
          </Badge>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2 text-muted-foreground">Total Patients</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{totalPatients}</p>
            <p className="text-sm text-muted-foreground">registered</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2 text-muted-foreground">Active Cases</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{waitingPatients + inProgressPatients}</p>
            <div className="flex gap-2 text-sm">
              <Badge variant="outline">{waitingPatients} waiting</Badge>
              <Badge variant="outline">{inProgressPatients} in progress</Badge>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2 text-muted-foreground">Critical Patients</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{criticalPatients}</p>
            <p className="text-sm text-muted-foreground">high priority</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2 text-muted-foreground">Average Wait</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{averageWaitTime}</p>
            <p className="text-sm text-muted-foreground">minutes</p>
          </div>
        </Card>
      </div>

      {/* Additional Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <h3 className="font-semibold mb-2 text-muted-foreground">Discharged Patients</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{dischargedPatients}</p>
            <p className="text-sm text-muted-foreground">today</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2 text-muted-foreground">Avg Treatment Time</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{averageTreatmentTime}</p>
            <p className="text-sm text-muted-foreground">minutes</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2 text-muted-foreground">Next Shift Change</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{staffData.nextShift}</p>
            <p className="text-sm text-muted-foreground">remaining</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Patient Arrivals (Last 12 Hours)</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyArrivals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Triage Level Distribution</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={triageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {triageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Staff Overview Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Physicians</span>
            </div>
            <p className="text-2xl font-bold">{staffData.onDuty.physicians}</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Nurses</span>
            </div>
            <p className="text-2xl font-bold">{staffData.onDuty.nurses}</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Specialists</span>
            </div>
            <p className="text-2xl font-bold">{staffData.onDuty.specialists}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}