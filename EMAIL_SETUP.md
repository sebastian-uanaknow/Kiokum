# Configuración de Emails para Invitaciones - ACTUALIZADO

## ✅ Estado Actual

La funcionalidad de invitaciones por email está **completamente implementada** usando **EmailJS**, un servicio gratuito que NO requiere acceso al dashboard de Supabase.

## 🎯 Nueva Solución: EmailJS

Hemos migrado el sistema de envío de emails a **EmailJS** porque:

- ✅ **No requiere acceso a Supabase**: Puedes configurarlo tú mismo sin necesidad de acceso al dashboard de Supabase
- ✅ **Gratis**: 200 emails/mes sin costo
- ✅ **Fácil de configurar**: Solo necesitas 5 minutos
- ✅ **Sin backend complejo**: Todo funciona desde el frontend de forma segura

## 📋 Cómo Configurar (MUY IMPORTANTE)

Para que los emails funcionen, **DEBES** seguir estos pasos:

### **👉 Lee el archivo: [EMAILJS_SETUP.md](./EMAILJS_SETUP.md) 👈**

Este archivo contiene:
- Instrucciones paso a paso con capturas
- Cómo crear tu cuenta en EmailJS (gratis)
- Cómo obtener tus credenciales
- Cómo configurar las variables de entorno
- Plantilla de email lista para copiar y pegar

## Cómo Funciona

Cuando agregas un usuario autorizado:
1. ✅ Se crea el registro en la base de datos `shared_access`
2. ✅ Se envía un email usando EmailJS con el diseño personalizado de Kiokum
3. ✅ El email incluye el rol específico asignado (👑 Propietario, ✏️ Editor, o 👁️ Visualizador)
4. ✅ Si EmailJS no está configurado, los permisos se crean igual pero el email no se envía

## Email Personalizado con Branding de Kiokum

El sistema envía emails completamente personalizados que incluyen:

### Contenido del Email

📧 **Asunto**: 🌸 Invitación a Kiokum como [Rol]

📝 **Contenido**:
- Header con gradiente y logo de Kiokum
- Nombre del usuario que envía la invitación
- Tarjeta destacada con:
  - Icono del rol (👑 Propietario / ✏️ Editor / 👁️ Visualizador)
  - Nombre del rol
  - Descripción específica de los permisos
- Botón para acceder directamente a la plataforma
- Instrucciones para registrarse si no tiene cuenta
- Footer con información de Kiokum

### Roles y Descripciones en el Email

**👑 Propietario**
- "Tendrás control total sobre los recuerdos: podrás visualizar, editar, eliminar y gestionar usuarios."

**✏️ Editor**
- "Podrás visualizar y editar los recuerdos compartidos contigo."

**👁️ Visualizador**
- "Podrás visualizar los recuerdos compartidos contigo."

## Configuración Rápida (Resumen)

1. Crea cuenta en [EmailJS](https://www.emailjs.com/)
2. Conecta tu servicio de email (Gmail recomendado)
3. Crea una plantilla usando el HTML de `EMAILJS_SETUP.md`
4. Obtén tus 3 credenciales:
   - Service ID
   - Template ID
   - Public Key
5. Agrégalas a tu archivo `.env`:

```env
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

6. ¡Listo! Los emails se enviarán automáticamente

## Funcionamiento

**Con EmailJS configurado:**
✅ Los emails se envían automáticamente con el diseño personalizado
✅ Incluye el rol específico del usuario
✅ Branding completo de Kiokum
✅ 200 emails gratis al mes

**Sin EmailJS configurado:**
⚠️ Los permisos se crean correctamente en la base de datos
⚠️ Los emails NO se envían (pero todo lo demás funciona)
⚠️ Verás una advertencia en la consola del navegador

## Verificar que Funciona

Después de configurar EmailJS:
1. Ve a tu Dashboard en Kiokum
2. Haz clic en "Gestionar usuarios"
3. Agrega un email y selecciona un rol
4. Haz clic en "Agregar usuario"
5. El usuario recibirá el email en unos segundos

Puedes monitorear los envíos en el dashboard de EmailJS.

## Solución Anterior (Resend)

La solución anterior con Resend requería acceso al dashboard de Supabase para configurar secrets. Si tienes acceso al dashboard de Supabase y prefieres usar Resend:

1. La Edge Function `send-invitation` sigue disponible
2. Solo necesitas agregar `RESEND_API_KEY` en los secrets de Supabase
3. La aplicación intentará usar Resend automáticamente si la variable existe

Pero si NO tienes acceso a Supabase, **EmailJS es tu mejor opción**.

## ❓ ¿Necesitas Ayuda?

Lee la documentación completa en: **[EMAILJS_SETUP.md](./EMAILJS_SETUP.md)**
