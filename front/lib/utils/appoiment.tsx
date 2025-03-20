import { AppointmentStatus } from "../../app/types/appointment";
import { BadgeProps } from "@/components/ui/badge";

export const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

export const getStatusBadge = (status: AppointmentStatus): BadgeProps["variant"] => {
    const variants: Record<AppointmentStatus, BadgeProps["variant"]> = {
        pending: "outline",
        confirmed: "default",
        completed: "secondary",
        canceled: "destructive",
    };
    return variants[status] || "default";
};