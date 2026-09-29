# Configuración de EmailJS para Invitaciones

## ✅ Estado Actual

La funcionalidad de invitaciones por email está **completamente implementada** y lista para funcionar. Solo necesitas configurar tu cuenta de EmailJS (gratis).

## 🎯 ¿Por qué EmailJS?

EmailJS es un servicio gratuito que permite enviar emails directamente desde tu aplicación sin necesidad de configurar servidores ni backends complejos.

**Ventajas:**
- ✅ **Gratis**: 200 emails/mes sin costo
- ✅ **Sin backend**: No requiere configuración en Supabase
- ✅ **Fácil de configurar**: Solo 5 minutos
- ✅ **Plantillas personalizables**: Diseña tus propios emails

## 📋 Configuración Paso a Paso

### Paso 1: Crear Cuenta en EmailJS

1. Ve a [EmailJS](https://www.emailjs.com/)
2. Haz clic en **"Sign Up"** (Registrarse)
3. Puedes registrarte con:
   - Google
   - GitHub
   - Email

### Paso 2: Agregar un Servicio de Email

1. Una vez dentro del dashboard, ve a **"Email Services"** en el menú lateral
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor de email favorito:
   - **Gmail** (recomendado si tienes Gmail)
   - **Outlook**
   - **Yahoo**
   - Otros

#### Para Gmail:
1. Selecciona **Gmail**
2. Haz clic en **"Connect Account"**
3. Autoriza EmailJS para enviar emails desde tu cuenta Gmail
4. Una vez conectado, verás tu **Service ID** (ejemplo: `service_abc123`)
5. **Copia este Service ID** - lo necesitarás más adelante

### Paso 3: Crear una Plantilla de Email

1. Ve a **"Email Templates"** en el menú lateral
2. Haz clic en **"Create New Template"**
3. En el editor de plantillas:

#### Configuración de la Plantilla:

**Subject (Asunto):**
```
🌸 Invitación a Kiokum como {{role_name}}
```

**Content (Contenido HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #2C1810;
      background-color: #F5EFE7;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #A8D5E2 0%, #F5EFE7 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 32px;
      color: #2C1810;
      margin: 0 0 8px 0;
      font-weight: 700;
    }
    .header p {
      color: #6B5D54;
      font-size: 16px;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #2C1810;
      font-size: 24px;
      margin: 0 0 20px 0;
      font-weight: 600;
    }
    .content p {
      color: #6B5D54;
      margin-bottom: 16px;
      font-size: 16px;
    }
    .role-card {
      background: linear-gradient(135deg, #F5EFE7 0%, #ffffff 100%);
      border: 2px solid #A8D5E2;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }
    .role-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    .role-name {
      font-size: 24px;
      font-weight: 700;
      color: #31250b;
      margin-bottom: 12px;
    }
    .role-description {
      color: #6B5D54;
      font-size: 15px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      background: #31250b;
      color: #ffffff !important;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
    }
    .info-box {
      background: #F5EFE7;
      border-left: 4px solid #A8D5E2;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .info-box p {
      color: #6B5D54;
      font-size: 14px;
      margin: 0;
    }
    .footer {
      background: #F5EFE7;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid #D4C4B0;
    }
    .footer p {
      color: #6B5D54;
      font-size: 14px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌸 Kiokum</h1>
      <p>Plataforma de Recuerdos</p>
    </div>
    <div class="content">
      <h2>¡Has recibido una invitación!</h2>
      <p><strong>{{sender_email}}</strong> te ha invitado a acceder a sus recuerdos en Kiokum.</p>

      <div class="role-card">
        <div class="role-icon">{{role_icon}}</div>
        <div class="role-name">{{role_name}}</div>
        <div class="role-description">{{role_description}}</div>
      </div>

      <p style="text-align: center; font-weight: 600; color: #2C1810;">Para acceder a la plataforma, haz clic en el botón:</p>

      <div style="text-align: center;">
        <a href="{{login_url}}" class="button">Acceder a Kiokum</a>
      </div>

      <div class="info-box">
        <p><strong>Nota:</strong> Si no tienes una cuenta, deberás registrarte con este correo electrónico (<strong>{{recipient_email}}</strong>) para acceder a los recuerdos compartidos contigo.</p>
      </div>

      <p style="font-size: 14px; color: #6B5D54; margin-top: 32px;">
        Este es un espacio para preservar y compartir momentos importantes. Tu acceso como <strong>{{role_name}}</strong> te permite colaborar de manera significativa.
      </p>
    </div>
    <div class="footer">
      <p>Este es un correo automático de Kiokum.</p>
      <p style="margin-top: 8px;">Por favor no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>
```

4. Haz clic en **"Save"** (Guardar)
5. **Copia el Template ID** que aparece arriba (ejemplo: `template_xyz789`)

### Paso 4: Obtener tu Public Key

1. Ve a **"Account"** en el menú lateral
2. En la sección **"API Keys"**, encontrarás tu **Public Key**
3. **Copia esta Public Key** (ejemplo: `A1b2C3d4E5f6G7h8I`)

### Paso 5: Configurar las Variables de Entorno

Ahora que tienes los 3 valores necesarios, agrégalos a tu archivo `.env`:

```env
# Configuración de EmailJS para envío de invitaciones
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
```

**Ejemplo con valores reales:**
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=A1b2C3d4E5f6G7h8I
```

### Paso 6: ¡Listo! 🎉

Una vez configurado:

1. **Los emails se enviarán automáticamente** cada vez que invites a un usuario
2. El email incluirá:
   - El nombre del usuario que envía la invitación
   - El rol asignado (Propietario, Editor o Visualizador)
   - Un botón para acceder directamente a Kiokum
   - Instrucciones para registrarse si no tiene cuenta

## 🧪 Probar que Funciona

1. Ve a tu Dashboard en Kiokum
2. Haz clic en **"Gestionar usuarios"**
3. Agrega un email y selecciona un rol
4. Haz clic en **"Agregar usuario"**
5. El usuario debería recibir el email en unos segundos

## 📊 Monitorear Envíos

En tu dashboard de EmailJS puedes:
- Ver cuántos emails has enviado
- Ver el estado de cada email (enviado, fallido, etc.)
- Ver tu cuota restante del mes

## ⚠️ Límites del Plan Gratuito

- **200 emails/mes** gratis
- Si necesitas más, puedes actualizar a un plan de pago (desde $9/mes para 1000 emails)

## 🔒 Seguridad

Las credenciales de EmailJS son seguras porque:
- La **Public Key** está diseñada para usarse en el frontend
- Solo permite enviar emails usando tus plantillas pre-configuradas
- No permite modificar la configuración de tu cuenta
- No expone información sensible

## ❓ Solución de Problemas

### El email no se envía
1. Verifica que las 3 variables estén correctamente configuradas en `.env`
2. Asegúrate de que los valores no tengan espacios al inicio o al final
3. Verifica que hayas guardado el archivo `.env`

### El email llega a spam
1. En EmailJS, verifica tu servicio de email
2. Considera usar un email personalizado (no Gmail personal)
3. Agrega información de contacto en el footer del email

### Error de autorización
1. Verifica que tu Public Key sea correcta
2. Asegúrate de que el servicio de email esté correctamente conectado
3. Verifica que la plantilla exista y esté guardada

## 📝 Personalización Adicional

Puedes personalizar el email editando la plantilla en EmailJS:
- Cambiar colores
- Modificar textos
- Agregar tu logo
- Cambiar el diseño

Las variables disponibles son:
- `{{to_email}}` - Email del destinatario
- `{{sender_email}}` - Email de quien envía
- `{{role_name}}` - Nombre del rol (Propietario, Editor, Visualizador)
- `{{role_icon}}` - Emoji del rol (👑, ✏️, 👁️)
- `{{role_description}}` - Descripción de los permisos
- `{{login_url}}` - URL para acceder a la plataforma
- `{{recipient_email}}` - Email del destinatario (para mostrar en el mensaje)

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa la [documentación de EmailJS](https://www.emailjs.com/docs/)
2. Verifica que hayas seguido todos los pasos
3. Comprueba la consola del navegador para ver errores específicos
