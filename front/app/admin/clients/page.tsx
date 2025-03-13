"use client";

import { useState, useEffect } from "react";

import AdminLayout from "../../components/layout/AdminLayout"

import { Moon, Sun, Monitor, Save, RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";
import { toast, Toaster } from "sonner";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [userSettings, setUserSettings] = useState({
        notificationsEnabled: true,
        emailNotifications: true,
        smsNotifications: true,
        language: "pt-BR",
        timeZone: "America/Sao_Paulo",
    });

    // Garantir que o componente está montado antes de acessar o tema
    useEffect(() => {
        setMounted(true);
    }, []);

    // Simular salvamento de configurações
    const handleSaveSettings = () => {
        setSaving(true);
        // Simulação de chamada de API
        setTimeout(() => {
            setSaving(false);
            toast.success("Configurações salvas com sucesso!");
        }, 1000);
    };

    // Evitar problemas de hidratação retornando null até que o componente esteja montado
    if (!mounted) {
        return null;
    }

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

                    {/* Tab de Aparência */}
                    <TabsContent value="appearance">
                        <Card>
                            <CardHeader>
                                <CardTitle>Aparência</CardTitle>
                                <CardDescription>
                                    Personalize a aparência da interface do administrador
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Tema</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Button
                                            variant={theme === "light" ? "default" : "outline"}
                                            className="flex items-center justify-center gap-2 h-20"
                                            onClick={() => setTheme("light")}
                                        >
                                            <Sun className="h-5 w-5" />
                                            <span>Claro</span>
                                        </Button>
                                        <Button
                                            variant={theme === "dark" ? "default" : "outline"}
                                            className="flex items-center justify-center gap-2 h-20"
                                            onClick={() => setTheme("dark")}
                                        >
                                            <Moon className="h-5 w-5" />
                                            <span>Escuro</span>
                                        </Button>
                                        <Button
                                            variant={theme === "system" ? "default" : "outline"}
                                            className="flex items-center justify-center gap-2 h-20"
                                            onClick={() => setTheme("system")}
                                        >
                                            <Monitor className="h-5 w-5" />
                                            <span>Sistema</span>
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Densidade de Layout</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Layout Compacto</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Reduz o espaçamento e tamanho dos elementos
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab de Notificações */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notificações</CardTitle>
                                <CardDescription>
                                    Configure como você recebe notificações e alertas
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Notificações</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Ativar ou desativar todas as notificações
                                        </p>
                                    </div>
                                    <Switch
                                        checked={userSettings.notificationsEnabled}
                                        onCheckedChange={(checked) =>
                                            setUserSettings({ ...userSettings, notificationsEnabled: checked })
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Notificações por Email</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receba atualizações por email
                                        </p>
                                    </div>
                                    <Switch
                                        checked={userSettings.emailNotifications}
                                        onCheckedChange={(checked) =>
                                            setUserSettings({ ...userSettings, emailNotifications: checked })
                                        }
                                        disabled={!userSettings.notificationsEnabled}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Notificações por SMS</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receba alertas importantes por SMS
                                        </p>
                                    </div>
                                    <Switch
                                        checked={userSettings.smsNotifications}
                                        onCheckedChange={(checked) =>
                                            setUserSettings({ ...userSettings, smsNotifications: checked })
                                        }
                                        disabled={!userSettings.notificationsEnabled}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab de Conta */}
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações da Conta</CardTitle>
                                <CardDescription>
                                    Atualize suas informações pessoais e credenciais
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome</Label>
                                        <Input id="name" defaultValue="Administrador" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue="admin@exemplo.com" />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Senha Atual</Label>
                                    <Input id="current-password" type="password" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">Nova Senha</Label>
                                        <Input id="new-password" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirmar Senha</Label>
                                        <Input id="confirm-password" type="password" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="ml-auto">Atualizar Senha</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Tab de Sistema */}
                    <TabsContent value="system">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configurações do Sistema</CardTitle>
                                <CardDescription>
                                    Configure parâmetros gerais do sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="language">Idioma</Label>
                                    <select
                                        id="language"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={userSettings.language}
                                        onChange={(e) => setUserSettings({ ...userSettings, language: e.target.value })}
                                    >
                                        <option value="pt-BR">Português (Brasil)</option>
                                        <option value="en-US">English (US)</option>
                                        <option value="es">Español</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Fuso Horário</Label>
                                    <select
                                        id="timezone"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={userSettings.timeZone}
                                        onChange={(e) => setUserSettings({ ...userSettings, timeZone: e.target.value })}
                                    >
                                        <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                                        <option value="America/New_York">Nova York (GMT-5)</option>
                                        <option value="Europe/London">Londres (GMT+0)</option>
                                        <option value="Europe/Paris">Paris (GMT+1)</option>
                                    </select>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Backup de Dados</Label>
                                    <Button variant="outline" className="w-full md:w-auto">
                                        Fazer Backup
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-end">
                    <Button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="flex items-center space-x-2"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Salvando...</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                <span>Salvar Todas as Configurações</span>
                            </>
                        )}
                    </Button>
                </div>

                <Toaster position="bottom-right" />
            </div>
        </AdminLayout>
    );
}