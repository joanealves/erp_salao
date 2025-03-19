import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type SettingsFooterProps = {
    saving: boolean;
    onSave: () => void;
};

export default function SettingsFooter({ saving, onSave }: SettingsFooterProps) {
    return (
        <div className="mt-6 flex justify-end">
            <Button
                onClick={onSave}
                disabled={saving}
                className="flex items-center space-x-2"
                aria-label="Botão salvar configurações"
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
    );
}