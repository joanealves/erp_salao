import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

type UserSettings = {
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: string;
    timeZone: string;
    compactLayout?: boolean;
};

type AppearanceTabProps = {
    userSettings: UserSettings;
    setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
};

export default function AppearanceTab({ userSettings, setUserSettings }: AppearanceTabProps) {
    const { theme, setTheme } = useTheme();

    const toggleCompactLayout = () => {
        setUserSettings(prev => ({
            ...prev,
            compactLayout: !prev.compactLayout
        }));
    };

    return (
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
                            aria-label="Botão selecionar tema claro"
                            onClick={() => setTheme("light")}
                        >
                            <Sun className="h-5 w-5" />
                            <span>Claro</span>
                        </Button>
                        <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            className="flex items-center justify-center gap-2 h-20"
                            aria-label="Botão selecionar tema escuro"
                            onClick={() => setTheme("dark")}
                        >
                            <Moon className="h-5 w-5" />
                            <span>Escuro</span>
                        </Button>
                        <Button
                            variant={theme === "system" ? "default" : "outline"}
                            className="flex items-center justify-center gap-2 h-20"
                            aria-label="Botão selecionar tema do sistema"
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
                        <Switch
                            checked={userSettings.compactLayout || false}
                            onCheckedChange={toggleCompactLayout}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}