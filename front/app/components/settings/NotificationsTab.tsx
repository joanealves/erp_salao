import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SettingsSwitchItem from "./SettingsSwitchItem";

type UserSettings = {
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: string;
    timeZone: string;
};

type NotificationsTabProps = {
    userSettings: UserSettings;
    setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
};

export default function NotificationsTab({ userSettings, setUserSettings }: NotificationsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                    Configure como você recebe notificações e alertas
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <SettingsSwitchItem
                    title="Notificações"
                    description="Ativar ou desativar todas as notificações"
                    checked={userSettings.notificationsEnabled}
                    onCheckedChange={(checked) =>
                        setUserSettings({ ...userSettings, notificationsEnabled: checked })
                    }
                />

                <Separator />

                <SettingsSwitchItem
                    title="Notificações por Email"
                    description="Receba atualizações por email"
                    checked={userSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                        setUserSettings({ ...userSettings, emailNotifications: checked })
                    }
                    disabled={!userSettings.notificationsEnabled}
                />

                <SettingsSwitchItem
                    title="Notificações por SMS"
                    description="Receba alertas importantes por SMS"
                    checked={userSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                        setUserSettings({ ...userSettings, smsNotifications: checked })
                    }
                    disabled={!userSettings.notificationsEnabled}
                />
            </CardContent>
        </Card>
    );
}