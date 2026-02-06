# BarberShop Demo - PRD

## Problema Original
Sistema demo SOLO FRONTEND sin base de datos (datos locales), para agenda de turnos de peluquería con dos tipos de usuarios: gestor y cliente.

## Arquitectura
- **Frontend**: React + Tailwind CSS + Shadcn UI + Framer Motion
- **Backend**: No requerido (datos en localStorage)
- **Base de Datos**: localStorage (sin MongoDB)

## Usuarios y Roles
| Rol | Usuario | Contraseña | Acceso |
|-----|---------|------------|--------|
| Gestor | gestor | demo123 | Dashboard, calendario, gestión de citas |
| Cliente | cliente | demo123 | Wizard de reserva de turnos |

## Funcionalidades Implementadas

### Panel Gestor
- Dashboard con estadísticas (citas del día, pendientes, confirmados, ingresos)
- Calendario interactivo con días marcados que tienen citas
- Lista de citas con detalles (cliente, servicios, barbero, precio)
- Modal de detalle con cambio de estado (Confirmar, Completar, Cancelar)
- Vista del equipo de barberos

### Portal Cliente
- Wizard de 4 pasos: Servicios → Barbero → Fecha/Hora → Confirmación
- Selección múltiple de servicios con cálculo de precio y duración
- Opción de barbero aleatorio para mayor disponibilidad
- Calendario con fechas disponibles (próximos 30 días)
- Slots de tiempo con disponibilidad en tiempo real
- Resumen y confirmación de reserva

### Servicios Disponibles
| Servicio | Precio | Duración |
|----------|--------|----------|
| Corte | $25 | 30 min |
| Lavado | $15 | 20 min |
| Barba | $20 | 25 min |
| Cejas | $10 | 15 min |
| Nariz | $8 | 10 min |

### Equipo de Barberos (5)
1. Enzo 'The Blade' - Master Barber
2. Marco V. - Senior Stylist
3. James K. - Beard Specialist
4. Dante - Colorist
5. Silas - Junior Barber

## Diseño
- Tema: Dark Luxury
- Colores: Obsidian (#0A0A0A), Gold (#D4AF37)
- Tipografía: Playfair Display (headings), Manrope (body)
- Efectos: Glassmorphism, animaciones con Framer Motion

## Estado: COMPLETADO ✅
- Fecha: Enero 2026
- Tests: 100% pasados

## Backlog P1 (Siguientes mejoras)
- Notificaciones push para recordatorio de citas
- Exportar citas a calendario (Google/iCal)
- Historial de citas del cliente
- Sistema de reseñas por barbero
