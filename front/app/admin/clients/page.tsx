// page.tsx (arquivo principal refatorado)
"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import AdminLayout from "../../components/layout/AdminLayout";
import ClientsTable from "../../components/ClientsTable";
import ClientSearch from "../../components/ClientSearch";
import ClientPagination from "../../components/ClientPagination";
import NewClientDialog from "../../components/NewClientDialog";
import ClientDetailsSheet from "../../components/ClientDetailsSheet";
import { useClient } from "../../hooks/useClient";
import { Client } from "./types";

export default function ClientsPage() {
    const {
        client,
        loading,
        totalPages,
        page,
        searchQuery,
        refreshing,
        fetchClient,
        handlePageChange,
        setSearchQuery,
        setPage
    } = useClient();

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isNewClientOpen, setIsNewClientOpen] = useState(false);

    const handleRefresh = () => {
        fetchClient(true);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (page === 1) {
            fetchClient();
        } else {
            setPage(1);
        }
    };

    const openClientDetails = (client: Client) => {
        setSelectedClient(client);
        setIsDetailsOpen(true);
    };

    const handleClientCreated = () => {
        setIsNewClientOpen(false);
        fetchClient();
        toast.success("Cliente cadastrado com sucesso!");
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Clientes</h1>
                        <p className="text-gray-500 mt-1">Cadastre e gerencie seus clientes</p>
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
                            onClick={() => setIsNewClientOpen(true)}
                            className="flex items-center space-x-2"
                        >
                            <Plus size={16} />
                            <span>Novo Cliente</span>
                        </Button>
                    </div>
                </div>

                <ClientSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSubmit={handleSearchSubmit}
                />

                <ClientsTable
                    clients={client}
                    loading={loading}
                    onViewDetails={openClientDetails}
                />

                <ClientPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                <NewClientDialog
                    isOpen={isNewClientOpen}
                    onOpenChange={setIsNewClientOpen}
                    onClientCreated={handleClientCreated}
                />

                <ClientDetailsSheet
                    client={selectedClient}
                    isOpen={isDetailsOpen}
                    onOpenChange={setIsDetailsOpen}
                />

                <Toaster position="bottom-right" />
            </div>
        </AdminLayout>
    );
}