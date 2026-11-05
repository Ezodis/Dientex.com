"use client"

import { MainLayout } from "@/app/components/layout/main-layout"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Separator } from "@/app/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react"

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Personaliza la aplicación según tus necesidades
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="general" className="flex-col gap-1 py-2 text-xs md:flex-row md:gap-2 md:text-sm">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-col gap-1 py-2 text-xs md:flex-row md:gap-2 md:text-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-col gap-1 py-2 text-xs md:flex-row md:gap-2 md:text-sm">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notif.</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-col gap-1 py-2 text-xs md:flex-row md:gap-2 md:text-sm">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Seguridad</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex-col gap-1 py-2 text-xs md:flex-row md:gap-2 md:text-sm">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Tema</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>
                  Ajustes generales de la clínica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinic-name">Nombre de la Clínica</Label>
                  <Input id="clinic-name" placeholder="Dientex" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-address">Dirección</Label>
                  <Input id="clinic-address" placeholder="Calle Principal #123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-phone">Teléfono</Label>
                  <Input id="clinic-phone" placeholder="+52 555 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-email">Correo Electrónico</Label>
                  <Input id="clinic-email" type="email" placeholder="contacto@dientex.com" />
                </div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>
                  Actualiza tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" placeholder="Dr. Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="juan@dientex.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+52 555 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Input id="specialty" placeholder="Odontología General" />
                </div>
                <Button>Actualizar Perfil</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>
                  Configura cómo deseas recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Notificaciones de Citas</p>
                    <p className="text-sm text-muted-foreground">
                      Recibe recordatorios de citas próximas
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Habilitar</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Notificaciones de Pagos</p>
                    <p className="text-sm text-muted-foreground">
                      Recibe alertas sobre pagos pendientes
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Habilitar</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Notificaciones por Email</p>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones en tu correo electrónico
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Habilitar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Gestiona la seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Cambiar Contraseña</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>
                  Personaliza la apariencia de la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Modo Oscuro</p>
                    <p className="text-sm text-muted-foreground">
                      Cambia entre modo claro y oscuro
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Activar</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Tamaño de Fuente</p>
                    <p className="text-sm text-muted-foreground">
                      Ajusta el tamaño del texto
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
