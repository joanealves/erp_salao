import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell
} from "recharts";

interface ChartData {
    name: string;
    Agendamentos: number;
    Receita: number;
}

interface ServiceData {
    name: string;
    value: number;
}

interface DashboardChartsProps {
    chartData: ChartData[];
    serviceData: ServiceData[];
    chartType: string;
    setChartType: (type: string) => void;
}

export default function DashboardCharts({
    chartData,
    serviceData,
    chartType,
    setChartType
}: DashboardChartsProps) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle>Desempenho</CardTitle>
                        <CardDescription>
                            Visão geral de agendamentos e receita
                        </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant={chartType === "line" ? "default" : "outline"}
                            size="sm"
                            aria-label="Botão para selecionar os tipos de graficos se de linha"
                            onClick={() => setChartType("line")}
                        >
                            <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={chartType === "bar" ? "default" : "outline"}
                            size="sm"
                            aria-label="Botão para selecionar os tipos de graficos, neste caso de barras"
                            onClick={() => setChartType("bar")}
                        >
                            <BarChart3 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === "line" ? (
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="Agendamentos" stroke="#8884d8" />
                                    <Line yAxisId="right" type="monotone" dataKey="Receita" stroke="#82ca9d" />
                                </LineChart>
                            ) : (
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Agendamentos" fill="#8884d8" />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Serviços Mais Procurados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie
                                    data={serviceData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {serviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}