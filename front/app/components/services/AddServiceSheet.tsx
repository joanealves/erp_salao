import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ServiceForm } from "./ServiceForm";
import { ServiceFormData } from "./types";

type AddServiceSheetProps = {
    isOpen: boolean;
    onClose: () => void;
    formData: ServiceFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => Promise<void>;
    isSubmitting?: boolean;
};

export function AddServiceSheet({
    isOpen,
    onClose,
    formData,
    onInputChange,
    onSubmit,
    isSubmitting = false
}: AddServiceSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Adicionar Serviço</SheetTitle>
                    <SheetDescription>
                        Preencha os detalhes do novo serviço.
                    </SheetDescription>
                </SheetHeader>

                <ServiceForm
                    formData={formData}
                    onInputChange={onInputChange}
                />

                <SheetFooter>
                    <Button
                        variant="outline"
                        aria-label="Botão Cancelar"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        aria-label="Botão Salvar"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Salvando..." : "Salvar"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}