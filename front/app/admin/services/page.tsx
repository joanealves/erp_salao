"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";

import AdminLayout from "../../components/layout/AdminLayout";
import { ServicesHeader } from "../../components/services/ServicesHeader";
import { ServicesTable } from "../../components/services/ServicesTable";
import { AddServiceSheet } from "../../components/services/AddServiceSheet";
import { EditServiceSheet } from "../../components/services/EditServiceSheet";
import { DeleteServiceDialog } from "../../components/services/DeleteServiceDialog";
import { Service, ServiceFormData } from "../../components/services/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Estados para os formulários e modais
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Estados para submissões
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Estado do formulário
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
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
            toast.error("Não foi possível carregar os serviços");
            setServices([]);
        } finally {
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

        if (name === "price" || name === "duration") {
            const numValue = value === "" ? null : parseFloat(value);
            setFormData({
                ...formData,
                [name]: numValue,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: null,
            duration: null,
        });
    };

    const openAddSheet = () => {
        resetForm();
        setIsAddSheetOpen(true);
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

    const handleDeleteClick = (service: Service) => {
        setSelectedService(service);
        setIsDeleteDialogOpen(true);
    };

    const handleAddService = async () => {
        if (!formData.name) {
            toast.error("O nome do serviço é obrigatório");
            return;
        }

        try {
            setIsSubmitting(true);

            // Dados formatados conforme esperado pelo modelo ServiceCreate
            const dataToSend = {
                name: formData.name.trim(),
                description: (formData.description || "").trim(),
                price: formData.price === null ? 0 : Number(formData.price),
                duration: formData.duration === null ? 30 : Number(formData.duration)
            };

            console.log("Dados enviados:", dataToSend);

            const response = await axios.post(`${API_URL}/services`, dataToSend);
            setServices([...services, response.data]);
            setIsAddSheetOpen(false);
            resetForm();
            toast.success("Serviço adicionado com sucesso");
        } catch (error) {
            console.error("Erro ao adicionar serviço:", error);

            // Mostrar detalhes do erro para debug
            if (error.response && error.response.data) {
                console.error("Detalhes do erro:", error.response.data);
                toast.error(`Erro: ${error.response.data.detail || 'Falha ao criar serviço'}`);
            } else {
                toast.error("Não foi possível adicionar o serviço");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateService = async () => {
        if (!selectedService) return;
        if (!formData.name) {
            toast.error("O nome do serviço é obrigatório");
            return;
        }

        // Validações adicionais
        if (formData.price === null || formData.duration === null) {
            toast.error("Preço e duração são obrigatórios");
            return;
        }

        try {
            setIsSubmitting(true);
            // Garantir que os valores são do tipo correto
            const dataToSend = {
                name: formData.name,
                description: formData.description || "",
                price: Number(formData.price) || 0,
                duration: Number(formData.duration) || 30,
            };

            const response = await axios.put(`${API_URL}/services/${selectedService.id}`, dataToSend);
            setServices(services.map(service =>
                service.id === selectedService.id ? response.data : service
            ));
            setIsEditSheetOpen(false);
            toast.success("Serviço atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar serviço:", error);
            toast.error("Não foi possível atualizar o serviço");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteService = async () => {
        if (!selectedService) return;

        try {
            setIsDeleting(true);
            await axios.delete(`${API_URL}/services/${selectedService.id}`);
            setServices(services.filter(service => service.id !== selectedService.id));
            setIsDeleteDialogOpen(false);
            toast.success("Serviço removido com sucesso");
        } catch (error) {
            console.error("Erro ao remover serviço:", error);
            toast.error("Não foi possível remover o serviço");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                <ServicesHeader
                    onRefresh={handleRefresh}
                    onAddNew={openAddSheet}
                    refreshing={refreshing}
                />

                <ServicesTable
                    services={services}
                    loading={loading}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />

                <AddServiceSheet
                    isOpen={isAddSheetOpen}
                    onClose={() => setIsAddSheetOpen(false)}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleAddService}
                    isSubmitting={isSubmitting}
                />

                <EditServiceSheet
                    isOpen={isEditSheetOpen}
                    onClose={() => setIsEditSheetOpen(false)}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleUpdateService}
                    isSubmitting={isSubmitting}
                />

                <DeleteServiceDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    serviceName={selectedService?.name || ""}
                    onConfirm={handleDeleteService}
                    isDeleting={isDeleting}
                />

                <Toaster position="bottom-right" />
            </div>
        </AdminLayout>
    );
}