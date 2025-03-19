"use client";

import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
// Importando as bibliotecas necessárias para exportação PDF
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function ReportsPage() {
    const [timeFrame, setTimeFrame] = useState("month");
    const [reportType, setReportType] = useState("revenue");
    const reportRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detecta se é dispositivo móvel
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Verificação inicial
        checkIfMobile();

        // Adiciona event listener para redimensionamento
        window.addEventListener("resize", checkIfMobile);

        // Cleanup
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    // Dados simulados para os gráficos
    const revenueData = [
        { name: "Jan", valor: 5000 },
        { name: "Fev", valor: 6200 },
        { name: "Mar", valor: 5100 },
        { name: "Abr", valor: 4900 },
        { name: "Mai", valor: 6800 },
        { name: "Jun", valor: 7200 },
    ];

    const appointmentsData = [
        { name: "Jan", valor: 120 },
        { name: "Fev", valor: 145 },
        { name: "Mar", valor: 132 },
        { name: "Abr", valor: 128 },
        { name: "Mai", valor: 152 },
        { name: "Jun", valor: 163 },
    ];

    const servicesData = [
        { name: "Corte Masculino", valor: 42 },
        { name: "Corte Feminino", valor: 28 },
        { name: "Barba", valor: 18 },
        { name: "Coloração", valor: 8 },
        { name: "Manicure", valor: 4 },
    ];

    const clientsData = [
        { name: "Novos", valor: 38 },
        { name: "Recorrentes", valor: 62 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    // Selecionar os dados com base no tipo de relatório
    const chartData =
        reportType === "revenue" ? revenueData :
            reportType === "appointments" ? appointmentsData :
                reportType === "services" ? servicesData :
                    clientsData;


    interface CustomizedLabelProps {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
        index: number;
        name?: string; 
    }

    // Função customizada para renderizar labels do gráfico de pizza
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent
    }: CustomizedLabelProps) => {
        // Não mostrar labels em dispositivos muito pequenos
        if (isMobile) return null;

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize="12"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const exportToPDF = async () => {
        try {
            if (reportRef.current) {
                // Mostrar indicador de carregamento se necessário

                // Capturar o elemento como imagem
                const canvas = await html2canvas(reportRef.current, {
                    scale: 2, // Melhor qualidade
                    useCORS: true, // Para permitir imagens de outros domínios se houver
                    logging: false // Desativar logs para produção
                });

                const imgData = canvas.toDataURL('image/png');

                // Inicializar o PDF no formato A4
                const pdf = new jsPDF('p', 'mm', 'a4');

                // Obter dimensões para manter proporção
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                // Adicionar a imagem ao PDF
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

                // Salvar o PDF
                pdf.save(`relatorio_${reportType}_${timeFrame}.pdf`);
            }
        } catch (error) {
            console.error("Erro ao exportar para PDF:", error);
            // Implementar notificação de erro para o usuário aqui
        }
    };

    const exportToCSV = () => {
        const headers = reportType === "revenue" ? "Mês,Valor\n" :
            reportType === "appointments" ? "Mês,Agendamentos\n" :
                "Serviço,Quantidade\n";

        const csvContent = "data:text/csv;charset=utf-8," +
            headers +
            chartData.map(item => `${item.name},${item.valor}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `relatorio_${reportType}_${timeFrame}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Relatórios</h1>
                        <p className="text-gray-500 mt-1">Análises detalhadas do seu negócio</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0 w-full md:w-auto">
                        <Button onClick={handlePrint} variant="outline" className="flex items-center space-x-2 flex-1 md:flex-none" aria-label="Botão para impressão do relatório">
                            <Printer size={16} />
                            <span>Imprimir</span>
                        </Button>
                        <Button onClick={exportToPDF} className="flex items-center space-x-2 flex-1 md:flex-none" aria-label="Botão para exportar relatório em PDF">
                            <Download size={16} />
                            <span>Exportar PDF</span>
                        </Button>
                        <Button onClick={exportToCSV} variant="outline" className="flex items-center space-x-2 flex-1 md:flex-none" aria-label="Botão Exportar relatório em CSV">
                            <Download size={16} />
                            <span>Exportar CSV</span>
                        </Button>
                    </div>
                </div>

                {/* Filtros */}
                <Card className="mb-6">
                    <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="w-full md:w-auto">
                            <p className="text-sm font-medium mb-2">Tipo de Relatório</p>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Tipo de Relatório" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="revenue">Faturamento</SelectItem>
                                    <SelectItem value="appointments">Agendamentos</SelectItem>
                                    <SelectItem value="services">Serviços</SelectItem>
                                    <SelectItem value="clients">Clientes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full md:w-auto">
                            <p className="text-sm font-medium mb-2">Período</p>
                            <Select value={timeFrame} onValueChange={setTimeFrame}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">Última Semana</SelectItem>
                                    <SelectItem value="month">Último Mês</SelectItem>
                                    <SelectItem value="quarter">Último Trimestre</SelectItem>
                                    <SelectItem value="year">Último Ano</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Conteúdo do Relatório */}
                <div ref={reportRef}>
                    <Tabs defaultValue="chart" className="mb-6">
                        <TabsList className="mb-4 w-full">
                            <TabsTrigger value="chart" className="flex-1">Gráfico</TabsTrigger>
                            <TabsTrigger value="table" className="flex-1">Tabela</TabsTrigger>
                        </TabsList>

                        <TabsContent value="chart">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {reportType === "revenue" ? "Faturamento" :
                                            reportType === "appointments" ? "Agendamentos" :
                                                reportType === "services" ? "Serviços Mais Procurados" :
                                                    "Perfil de Clientes"}
                                    </CardTitle>
                                    <CardDescription>
                                        {timeFrame === "week" ? "Últimos 7 dias" :
                                            timeFrame === "month" ? "Últimos 30 dias" :
                                                timeFrame === "quarter" ? "Últimos 3 meses" :
                                                    "Últimos 12 meses"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] md:h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            {reportType === "services" || reportType === "clients" ? (
                                                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                                    <Pie
                                                        data={chartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={renderCustomizedLabel}
                                                        outerRadius="80%"
                                                        innerRadius={isMobile ? "30%" : "0%"}
                                                        fill="#8884d8"
                                                        dataKey="valor"
                                                        paddingAngle={2}
                                                    >
                                                        {chartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                                                    <Legend
                                                        layout={isMobile ? "horizontal" : "vertical"}
                                                        align={isMobile ? "center" : "right"}
                                                        verticalAlign={isMobile ? "bottom" : "middle"}
                                                        wrapperStyle={isMobile ?
                                                            { paddingTop: '10px' } :
                                                            { right: 0, paddingLeft: '10px' }
                                                        }
                                                        formatter={(value, entry) => {
                                                            const { payload } = entry;
                                                            return `${payload.name}: ${payload.valor}`;
                                                        }}
                                                    />
                                                </PieChart>
                                            ) : (
                                                <BarChart
                                                    data={chartData}
                                                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip
                                                        formatter={(value) => reportType === "revenue" ? `R$ ${value}` : value}
                                                    />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="valor"
                                                        fill="#8884d8"
                                                        name={reportType === "revenue" ? "Faturamento" : "Agendamentos"}
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                </BarChart>
                                            )}
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="table">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {reportType === "revenue" ? "Faturamento" :
                                            reportType === "appointments" ? "Agendamentos" :
                                                reportType === "services" ? "Serviços Mais Procurados" :
                                                    "Perfil de Clientes"}
                                    </CardTitle>
                                    <CardDescription>
                                        Dados detalhados em formato de tabela
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-3 px-4">
                                                        {reportType === "services" || reportType === "clients" ? "Categoria" : "Período"}
                                                    </th>
                                                    <th className="text-right py-3 px-4">
                                                        {reportType === "revenue" ? "Faturamento (R$)" :
                                                            reportType === "appointments" ? "Agendamentos" :
                                                                reportType === "services" ? "Quantidade" : "Porcentagem"}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {chartData.map((item, index) => (
                                                    <tr key={index} className="border-b">
                                                        <td className="py-3 px-4">{item.name}</td>
                                                        <td className="text-right py-3 px-4">
                                                            {reportType === "revenue" ? `R$ ${item.valor.toFixed(2)}` :
                                                                reportType === "clients" ? `${item.valor}%` :
                                                                    item.valor}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(reportType === "revenue" || reportType === "appointments") && (
                                                    <tr className="font-bold bg-gray-50">
                                                        <td className="py-3 px-4">Total</td>
                                                        <td className="text-right py-3 px-4">
                                                            {reportType === "revenue"
                                                                ? `R$ ${chartData.reduce((sum, item) => sum + item.valor, 0).toFixed(2)}`
                                                                : chartData.reduce((sum, item) => sum + item.valor, 0)}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4 md:p-6">
                                <div className="text-xl md:text-2xl font-bold mb-1">
                                    {reportType === "revenue" ? "R$ 32.200,00" : "738"}
                                </div>
                                <p className="text-gray-500 text-sm">
                                    {reportType === "revenue" ? "Faturamento Total" : "Total de Agendamentos"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 md:p-6">
                                <div className="text-xl md:text-2xl font-bold mb-1 text-green-600">+12%</div>
                                <p className="text-gray-500 text-sm">Crescimento vs. Período Anterior</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 md:p-6">
                                <div className="text-xl md:text-2xl font-bold mb-1">
                                    {reportType === "revenue" ? "R$ 175,20" : "4,2"}
                                </div>
                                <p className="text-gray-500 text-sm">
                                    {reportType === "revenue" ? "Ticket Médio" : "Serviços por Cliente"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 md:p-6">
                                <div className="text-xl md:text-2xl font-bold mb-1">78%</div>
                                <p className="text-gray-500 text-sm">Taxa de Ocupação</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}