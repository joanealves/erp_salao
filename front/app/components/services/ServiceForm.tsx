import { Input } from "@/components/ui/input";
import { ServiceFormData } from "./types";

type ServiceFormProps = {
    formData: ServiceFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    idPrefix?: string;
};

export function ServiceForm({ formData, onInputChange, idPrefix = "" }: ServiceFormProps) {
    const prefix = idPrefix ? `${idPrefix}-` : "";

    return (
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <label htmlFor={`${prefix}name`}>Nome</label>
                <Input
                    id={`${prefix}name`}
                    name="name"
                    value={formData.name || ""}
                    onChange={onInputChange}
                    placeholder="Ex: Corte Masculino"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor={`${prefix}description`}>Descrição</label>
                <Input
                    id={`${prefix}description`}
                    name="description"
                    value={formData.description || ""}
                    onChange={onInputChange}
                    placeholder="Descrição do serviço"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor={`${prefix}duration`}>Duração (minutos)</label>
                <Input
                    id={`${prefix}duration`}
                    name="duration"
                    type="number"
                    value={formData.duration === 0 ? "" : formData.duration || ""}
                    onChange={onInputChange}
                    placeholder="30"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor={`${prefix}price`}>Preço (R$)</label>
                <Input
                    id={`${prefix}price`}
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price === 0 ? "" : formData.price || ""}
                    onChange={onInputChange}
                    placeholder="0.00"
                />
            </div>
        </div>
    );
}