import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

const colorClasses: Record<string, string> = {
    primary: "bg-blue-100 text-blue-600",
    secondary: "bg-gray-100 text-gray-600",
    success: "bg-green-100 text-green-600",
    danger: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
};

interface StatCardProps {
    icon: LucideIcon;
    title: string;
    value: string | number;
    color: keyof typeof colorClasses;
}

export default function StatCard({ icon: Icon, title, value, color }: StatCardProps) {
    return (
        <Card className="p-4 flex items-center shadow-sm">
            <div className={`rounded-full p-3 mr-3 ${colorClasses[color] || "bg-gray-100 text-gray-600"}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
                <p className="text-xs text-gray-500 truncate">{title}</p>
                <p className="text-lg md:text-xl font-bold truncate">{value}</p>
            </div>
        </Card>
    );
}