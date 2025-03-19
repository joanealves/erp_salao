import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type DeleteServiceDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
    onConfirm: () => Promise<void>;
    isDeleting?: boolean;
};

export function DeleteServiceDialog({
    isOpen,
    onClose,
    serviceName,
    onConfirm,
    isDeleting = false
}: DeleteServiceDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar exclusão</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o serviço {serviceName}? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 p-4">
                    <Button
                        variant="outline"
                        aria-label="Botão cancelar"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        aria-label="Botão excluir"
                    >
                        {isDeleting ? "Excluindo..." : "Excluir"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}