"use client";

import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2, AlertTriangle } from "lucide-react";
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
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { fetchReportData, fetchReportSummary, ReportData, ReportSummary } from "../../../services/api";
import { useToast } from "../../../hooks/use-toast";

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

export default function ReportsPage() {
    const [timeFrame, setTimeFrame] = useState("month");
    const [reportType, setReportType] = useState("revenue");
    const reportRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const { toast } = useToast();

    // Estado para armazenar os dados do relatório
    const [chartData, setChartData] = useState<ReportData[]>([]);
    const [summaryData, setSummaryData] = useState<ReportSummary>({
        total: 0,
        growth_rate: 0,
        avg_value: 0,
        occupation_rate: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    // Carregar dados do relatório sempre que o tipo ou período mudar
    useEffect(() => {
        const loadReportData = async () => {
            setLoading(true);
            setError(null); // Reset error state

            try {
                console.log(`Buscando dados para: ${reportType}, período: ${timeFrame}`);

                // Buscar dados do relatório
                const data = await fetchReportData(reportType, timeFrame);
                console.log("Dados recebidos:", data);
                setChartData(data);

                // Buscar dados do resumo (para todos os tipos de relatório)
                if (reportType === "revenue" || reportType === "appointments") {
                    const summary = await fetchReportSummary(reportType, timeFrame);
                    console.log("Resumo recebido:", summary);
                    setSummaryData(summary);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setError("Não foi possível carregar os dados do relatório");
                toast({
                    title: "Erro ao carregar dados",
                    description: "Não foi possível carregar os dados do relatório. Tente novamente.",
                    variant: "destructive"
                });

                // Set empty data to prevent crashes
                setChartData([]);
            } finally {
                setLoading(false);
            }
        };

        loadReportData();
    }, [reportType, timeFrame]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

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
                // Capturar o elemento como imagem
                const canvas = await html2canvas(reportRef.current, {
                    scale: 2,
                    useCORS: true,
                    logging: false
                } as any);

                const imgData = canvas.toDataURL('image/png');

                const pdf = new jsPDF('p', 'mm', 'a4');

                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

                pdf.save(`relatorio_${reportType}_${timeFrame}.pdf`);

                toast({
                    title: "PDF exportado com sucesso",
                    description: "O relatório foi exportado em formato PDF",
                    variant: "default"
                });
            }
        } catch (error) {
            console.error("Erro ao exportar para PDF:", error);
            toast({
                title: "Erro ao exportar PDF",
                description: "Não foi possível gerar o arquivo PDF. Tente novamente.",
                variant: "destructive"
            });
        }
    };

    const exportToCSV = () => {
        try {
            if (!chartData || chartData.length === 0) {
                toast({
                    title: "Sem dados para exportar",
                    description: "Não há dados disponíveis para exportar em CSV",
                    variant: "destructive"
                });
                return;
            }

            const headers = reportType === "revenue" ? "Período,Valor\n" :
                reportType === "appointments" ? "Período,Agendamentos\n" :
                    "Categoria,Quantidade\n";

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

            toast({
                title: "CSV exportado com sucesso",
                description: "O relatório foi exportado em formato CSV",
                variant: "default"
            });
        } catch (error) {
            console.error("Erro ao exportar para CSV:", error);
            toast({
                title: "Erro ao exportar CSV",
                description: "Não foi possível gerar o arquivo CSV. Tente novamente.",
                variant: "destructive"
            });
        }
    };

    // Função para formatar valores
    const formatValue = (value: number, type: string) => {
        if (type === "revenue") {
            return `R$ ${value.toFixed(2).replace(".", ",")}`;
        }
        return value.toString();
    };

    // Componente para mostrar o resumo
    const ReportSummaryCards = () => {
        if (reportType !== "revenue" && reportType !== "appointments") {
            return null;
        }

        const isRevenue = reportType === "revenue";

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                            {isRevenue ? "Faturamento Total" : "Total de Agendamentos"}
                        </div>
                        <div className="text-2xl font-bold">
                            {isRevenue
                                ? `R$ ${summaryData.total.toFixed(2).replace(".", ",")}`
                                : summaryData.total}
                        </div>
                        <div className={`text-sm mt-1 ${summaryData.growth_rate >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {summaryData.growth_rate >= 0 ? "↑" : "↓"} {Math.abs(summaryData.growth_rate).toFixed(1)}% do período anterior
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                            {isRevenue ? "Ticket Médio" : "Agendamentos por Cliente"}
                        </div>
                        <div className="text-2xl font-bold">
                            {isRevenue
                                ? `R$ ${summaryData.avg_value.toFixed(2).replace(".", ",")}`
                                : summaryData.avg_value.toFixed(1)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                            Taxa de Ocupação
                        </div>
                        <div className="text-2xl font-bold">
                            {summaryData.occupation_rate.toFixed(1)}%
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                            Período
                        </div>
                        <div className="text-2xl font-bold">
                            {timeFrame === "week" ? "Última Semana" :
                                timeFrame === "month" ? "Último Mês" :
                                    timeFrame === "quarter" ? "Último Trimestre" :
                                        "Último Ano"}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderChart = () => {
        if (chartData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <AlertTriangle className="h-10 w-10 text-yellow-500 mb-2" />
                    <p className="text-lg font-medium">Sem dados disponíveis para o período selecionado</p>
                    <p className="text-sm text-gray-500">Tente selecionar um período diferente</p>
                </div>
            );
        }

        if (reportType === "revenue" || reportType === "appointments") {
            // Para faturamento e agendamentos, usar gráfico de linha ou barra
            return (
                <Tabs defaultValue="line">
                    <TabsList className="mb-4">
                        <TabsTrigger value="line">Linha</TabsTrigger>
                        <TabsTrigger value="bar">Barra</TabsTrigger>
                    </TabsList>

                    <TabsContent value="line" className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [formatValue(Number(value), reportType), reportType === "revenue" ? "Valor" : "Agendamentos"]}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="valor"
                                    stroke="#0088FE"
                                    name={reportType === "revenue" ? "Faturamento" : "Agendamentos"}
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </TabsContent>

                    <TabsContent value="bar" className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [formatValue(Number(value), reportType), reportType === "revenue" ? "Valor" : "Agendamentos"]}
                                />
                                <Legend />
                                <Bar
                                    dataKey="valor"
                                    name={reportType === "revenue" ? "Faturamento" : "Agendamentos"}
                                    fill="#0088FE"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </TabsContent>
                </Tabs>
            );
        } else {
            // Para serviços e clientes, usar gráfico de pizza
            return (
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={!isMobile}
                                label={renderCustomizedLabel}
                                outerRadius={isMobile ? 80 : 120}
                                fill="#8884d8"
                                dataKey="valor"
                                nameKey="name"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, reportType === "services" ? "Quantidade" : "Percentual"]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            );
        }
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

                {/* Resumo do Relatório */}
                <ReportSummaryCards />

                {/* Relatório Principal */}
                <Card ref={reportRef} className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            {reportType === "revenue" ? "Faturamento" :
                                reportType === "appointments" ? "Agendamentos" :
                                    reportType === "services" ? "Serviços Mais Procurados" :
                                        "Distribuição de Clientes"}
                        </CardTitle>
                        <CardDescription>
                            {reportType === "revenue" ? "Análise do faturamento ao longo do tempo" :
                                reportType === "appointments" ? "Análise de agendamentos ao longo do tempo" :
                                    reportType === "services" ? "Quais serviços têm maior demanda" :
                                        "Clientes novos vs. recorrentes"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span className="ml-2 text-lg">Carregando dados...</span>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
                                <p className="text-lg font-medium">Erro ao carregar os dados</p>
                                <p className="text-sm text-gray-500">{error}</p>
                            </div>
                        ) : (
                            renderChart()
                        )}
                    </CardContent>
                </Card>

                {/* Dicas e Interpretação */}
                <Card>
                    <CardHeader>
                        <CardTitle>Insights e Recomendações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reportType === "revenue" && (
                                <>
                                    <p>
                                        <strong>Análise de Faturamento:</strong> Observe os padrões de receita ao longo do tempo
                                        para identificar tendências sazonais ou períodos de crescimento.
                                    </p>
                                    <p>
                                        <strong>Dicas:</strong> Para aumentar o faturamento, considere estratégias como
                                        promoções em períodos de baixa, ajuste de preços em serviços populares,
                                        ou pacotes de serviços combinados.
                                    </p>
                                </>
                            )}

                            {reportType === "appointments" && (
                                <>
                                    <p>
                                        <strong>Análise de Agendamentos:</strong> Use esses dados para identificar períodos
                                        de alta e baixa demanda, permitindo melhor planejamento de recursos.
                                    </p>
                                    <p>
                                        <strong>Dicas:</strong> Otimize sua agenda oferecendo descontos em horários menos
                                        procurados e reforçando a equipe nos períodos de pico identificados.
                                    </p>
                                </>
                            )}

                            {reportType === "services" && (
                                <>
                                    <p>
                                        <strong>Análise de Serviços:</strong> Identifique quais serviços geram mais
                                        receita e têm maior procura para otimizar seu catálogo.
                                    </p>
                                    <p>
                                        <strong>Dicas:</strong> Invista em treinamento e recursos para os serviços mais
                                        populares, e considere revisitar a estratégia para serviços menos procurados.
                                    </p>
                                </>
                            )}

                            {reportType === "clients" && (
                                <>
                                    <p>
                                        <strong>Análise de Clientes:</strong> Entenda a proporção entre novos clientes e
                                        recorrentes para equilibrar estratégias de aquisição e retenção.
                                    </p>
                                    <p>
                                        <strong>Dicas:</strong> Um negócio saudável precisa de um fluxo constante de novos
                                        clientes, mas lembre-se que fidelizar clientes existentes geralmente custa menos
                                        que adquirir novos.
                                    </p>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};    