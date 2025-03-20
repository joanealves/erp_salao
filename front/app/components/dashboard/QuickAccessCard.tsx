import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

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

interface QuickAccessCardProps {
    href: string;
    icon: LucideIcon;
    title: string;
    description: string;
    color: keyof typeof colorClasses;
}

export default function QuickAccessCard({ href, icon: Icon, title, description, color }: QuickAccessCardProps) {
    return (
        <Link href={href}>
            <Card className="p-4 hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="flex items-center mb-2">
                    <div className={`rounded-full p-2 mr-2 ${colorClasses[color] || "bg-gray-100 text-gray-600"}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-medium">{title}</h3>
                </div>
                <p className="text-xs text-gray-500">{description}</p>
            </Card>
        </Link>
    );
}