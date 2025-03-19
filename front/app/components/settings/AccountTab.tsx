import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function AccountTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
                <CardDescription>
                    Atualize suas informações pessoais e credenciais
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" defaultValue="Administrador" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="admin@exemplo.com" />
                    </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Senha</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="ml-auto" aria-label="Botão atualizar senha">Atualizar Senha</Button>
            </CardFooter>
        </Card>
    );
}