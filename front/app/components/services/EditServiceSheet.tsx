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

type EditServiceSheetProps = {
    isOpen: boolean;
    onClose: () => void;
    formData: ServiceFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => Promise<void>;
    isSubmitting?: boolean;
};

export function EditServiceSheet({
    isOpen,
    onClose,
    formData,
    onInputChange,
    onSubmit,
    isSubmitting = false
}: EditServiceSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Editar Serviço</SheetTitle>
                    <SheetDescription>
                        Atualize os detalhes do serviço.
                    </SheetDescription>
                </SheetHeader>

                <ServiceForm
                    formData={formData}
                    onInputChange={onInputChange}
                    idPrefix="edit"
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
                        aria-label="Botão Atualizar"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Atualizando..." : "Atualizar"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
