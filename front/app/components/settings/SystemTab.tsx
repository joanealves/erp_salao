import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type UserSettings = {
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: string;
    timeZone: string;
};

type SystemTabProps = {
    userSettings: UserSettings;
    setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
};

export default function SystemTab({ userSettings, setUserSettings }: SystemTabProps) {
    return (
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
    );
}