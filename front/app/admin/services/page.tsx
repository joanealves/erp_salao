"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import AdminLayout from "../../components/layout/AdminLayout"

import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Plus,
    Pencil,
    Trash2,
    RefreshCw,
    Save,
    X
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Service = {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number;
};

type ServiceFormData = Omit<Service, 'id'>;

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<ServiceFormData>({
        name: "",
        description: "",
        price: 0,
        duration: 30,
    });

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/services`);
            setServices(response.data || []);
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
            toast.error("Não foi possível carregar os serviços");
            setServices([]);
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchServices();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "price" || name === "duration" ? parseFloat(value) : value,
        });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: 0,
            duration: 30,
        });
    };

    const handleAddService = async () => {
        try {
            if (!formData.name) {
                toast.error("O nome do serviço é obrigatório");
                return;
            }

            const response = await axios.post(`${API_URL}/services`, formData);
            setServices([...services, response.data]);
            setIsAddSheetOpen(false);
            resetForm();
            toast.success("Serviço adicionado com sucesso");
        } catch (error) {
            console.error("Erro ao adicionar serviço:", error);
            toast.error("Não foi possível adicionar o serviço");
        }
    };

    const handleEditClick = (service: Service) => {
        setSelectedService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
        });
        setIsEditSheetOpen(true);
    };

    const handleUpdateService = async () => {
        if (!selectedService) return;

        try {
            if (!formData.name) {
                toast.error("O nome do serviço é obrigatório");
                return;
            }

            const response = await axios.put(`${API_URL}/services/${selectedService.id}`, formData);
            setServices(services.map(service =>
                service.id === selectedService.id ? response.data : service
            ));
            setIsEditSheetOpen(false);
            toast.success("Serviço atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar serviço:", error);
            toast.error("Não foi possível atualizar o serviço");
        }
    };

    const handleDeleteClick = (service: Service) => {
        setSelectedService(service);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteService = async () => {
        if (!selectedService) return;

        try {
            await axios.delete(`${API_URL}/services/${selectedService.id}`);
            setServices(services.filter(service => service.id !== selectedService.id));
            setIsDeleteDialogOpen(false);
            toast.success("Serviço removido com sucesso");
        } catch (error) {
            console.error("Erro ao remover serviço:", error);
            toast.error("Não foi possível remover o serviço");
        }
    };

    return (
        <AdminLayout>  
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Serviços</h1>
                    <p className="text-gray-500 mt-1">Cadastre e gerencie os serviços oferecidos</p>
                </div>
                <div className="flex mt-4 md:mt-0 space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center space-x-2"
                    >
                        {refreshing ? (
                            <>
                                <RefreshCw className="animate-spin" size={16} />
                                <span>Atualizando...</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw size={16} />
                                <span>Atualizar</span>
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={() => {
                            resetForm();
                            setIsAddSheetOpen(true);
                        }}
                        className="flex items-center space-x-2"
                    >
                        <Plus size={16} />
                        <span>Novo Serviço</span>
                    </Button>
                </div>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Duração (min)</TableHead>
                            <TableHead>Preço (R$)</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : services.length > 0 ? (
                            services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell>{service.description}</TableCell>
                                    <TableCell>{service.duration}</TableCell>
                                    <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditClick(service)}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteClick(service)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Nenhum serviço encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Sheet para adicionar serviço */}
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Adicionar Serviço</SheetTitle>
                        <SheetDescription>
                            Preencha os detalhes do novo serviço.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="name">Nome</label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Ex: Corte Masculino"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description">Descrição</label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Descrição do serviço"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="duration">Duração (minutos)</label>
                            <Input
                                id="duration"
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder="30"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="price">Preço (R$)</label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button variant="outline" onClick={() => setIsAddSheetOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleAddService}>Salvar</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Sheet para editar serviço */}
            <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Editar Serviço</SheetTitle>
                        <SheetDescription>
                            Atualize os detalhes do serviço.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="edit-name">Nome</label>
                            <Input
                                id="edit-name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Ex: Corte Masculino"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-description">Descrição</label>
                            <Input
                                id="edit-description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Descrição do serviço"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-duration">Duração (minutos)</label>
                            <Input
                                id="edit-duration"
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder="30"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-price">Preço (R$)</label>
                            <Input
                                id="edit-price"
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button variant="outline" onClick={() => setIsEditSheetOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleUpdateService}>Atualizar</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Dialog para confirmar exclusão */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir o serviço {selectedService?.name}? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 p-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={handleDeleteService}
                        >
                            Excluir
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>


            <Toaster position="bottom-right" />
            </div>
        </AdminLayout>    
    );
}