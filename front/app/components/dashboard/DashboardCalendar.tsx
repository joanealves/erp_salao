import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminCalendar from "../AdminCalendar";

export default function DashboardCalendar() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Calendário de Agendamentos</CardTitle>
                <CardDescription>Visão completa dos agendamentos do período</CardDescription>
            </CardHeader>
            <CardContent>
                <AdminCalendar initialAppointments={[]} />
            </CardContent>
        </Card>
    );
}