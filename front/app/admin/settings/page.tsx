"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "../../components/layout/AdminLayout";

// Importação dos componentes de abas
import AppearanceTab from "../../components/settings/AppearanceTab";
import NotificationsTab from "../../components/settings/NotificationsTab";
import AccountTab from "../../components/settings/AccountTab";
import SystemTab from "../../components/settings/SystemTab";
import SettingsFooter from "../../components/settings/SettingsFooter";

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [userSettings, setUserSettings] = useState({
        notificationsEnabled: true,
        emailNotifications: true,
        smsNotifications: true,
        language: "pt-BR",
        timeZone: "America/Sao_Paulo",
    });

    // Simular salvamento de configurações
    const handleSaveSettings = () => {
        setSaving(true);
        // Simulação de chamada de API
        setTimeout(() => {
            setSaving(false);
            toast.success("Configurações salvas com sucesso!");
        }, 1000);
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                <div className="flex flex-col mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold">Configurações</h1>
                    <p className="text-gray-500 mt-1">Gerencie as configurações do sistema</p>
                </div>

                <Tabs defaultValue="appearance" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="appearance">Aparência</TabsTrigger>
                        <TabsTrigger value="notifications">Notificações</TabsTrigger>
                        <TabsTrigger value="account">Conta</TabsTrigger>
                        <TabsTrigger value="system">Sistema</TabsTrigger>
                    </TabsList>

                    <TabsContent value="appearance">
                        <AppearanceTab
                            userSettings={userSettings}
                            setUserSettings={setUserSettings}
                        />
                    </TabsContent>

                    <TabsContent value="notifications">
                        <NotificationsTab
                            userSettings={userSettings}
                            setUserSettings={setUserSettings}
                        />
                    </TabsContent>

                    <TabsContent value="account">
                        <AccountTab
                            userSettings={userSettings}
                            setUserSettings={setUserSettings}
                        />
                    </TabsContent>

                    <TabsContent value="system">
                        <SystemTab
                            userSettings={userSettings}
                            setUserSettings={setUserSettings}
                        />
                    </TabsContent>
                </Tabs>

                <SettingsFooter
                    saving={saving}
                    onSave={handleSaveSettings}
                />

                <Toaster position="bottom-right" />
            </div>
        </AdminLayout>
    );
}