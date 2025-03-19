import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type SettingsSwitchItemProps = {
    title: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
};

export default function SettingsSwitchItem({
    title,
    description,
    checked,
    onCheckedChange,
    disabled = false
}: SettingsSwitchItemProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <Label>{title}</Label>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
            />
        </div>
    );
}