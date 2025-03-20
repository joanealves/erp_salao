import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppointmentTable() {
    const appointments = [
        { id: 1, name: "João Silva", service: "Corte Masculino", time: "14:00", status: "confirmed" },
        { id: 2, name: "Maria Oliveira", service: "Corte Feminino", time: "15:30", status: "pending" },
        { id: 3, name: "Pedro Santos", service: "Barba", time: "16:45", status: "confirmed" },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Próximos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-2">Cliente</th>
                                <th className="text-left py-3 px-2 hidden md:table-cell">Serviço</th>
                                <th className="text-left py-3 px-2">Horário</th>
                                <th className="text-left py-3 px-2 hidden sm:table-cell">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-2">{appointment.name}</td>
                                    <td className="py-3 px-2 hidden md:table-cell">{appointment.service}</td>
                                    <td className="py-3 px-2">{appointment.time}</td>
                                    <td className="py-3 px-2 hidden sm:table-cell">
                                        <span className={`px-2 py-1 rounded-full text-xs ${appointment.status === "confirmed"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                            {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-center">
                    <Button asChild variant="outline" size="sm" aria-label="Botão de visualizar todos os agendamentos, redirecionamento de tab">
                        <Link href="/admin/appointments">Ver Todos</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}