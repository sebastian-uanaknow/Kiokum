# Configuración de Seguridad de Supabase

## Estado Actual

✅ **Corrección de search_path aplicada**
- La función `has_memory_permission` ahora está protegida contra ataques de search_path
- Se agregó `SET search_path = ''` y nombres de esquema totalmente cualificados

## Protección contra Contraseñas Comprometidas (HaveIBeenPwned)

⚠️ **Requiere Plan Pro o superior de Supabase**

### ¿Qué es?

Supabase integra la API de HaveIBeenPwned.org para rechazar contraseñas que han sido expuestas en filtraciones de datos. Esto previene que usuarios utilicen contraseñas comprometidas conocidas por atacantes.

### Cómo Activarlo

**Paso 1: Verificar tu Plan**
- Ve al Dashboard de Supabase
- Verifica que tengas Plan Pro o superior
- (El plan gratuito no incluye esta funcionalidad)

**Paso 2: Activar la Protección**
1. En el Dashboard de Supabase, navega a:
   ```
   Authentication → Policies → Password Protection
   ```
   O directamente:
   ```
   Settings → Authentication → Password Protection
   ```

2. Activa el toggle de **"Prevent compromised passwords"**

3. Guarda los cambios

### ¿Cómo Funciona?

Cuando un usuario intenta:
- ✅ Registrarse con una nueva contraseña
- ✅ Cambiar su contraseña existente

El sistema:
1. Verifica la contraseña contra la base de datos de HaveIBeenPwned
2. Si la contraseña ha sido filtrada, rechaza el intento
3. Devuelve un error claro al usuario:
   ```json
   {
     "message": "Password has been leaked",
     "status": 422
   }
   ```

### Privacidad

🔒 **Es completamente seguro:**
- No envía tu contraseña completa a HaveIBeenPwned
- Usa el protocolo k-anonymity
- Solo envía los primeros 5 caracteres del hash SHA-1
- HaveIBeenPwned devuelve todos los hashes que coinciden
- Supabase verifica localmente si tu contraseña específica está comprometida

### Alternativa para Plan Gratuito

Si estás en el plan gratuito y deseas protección similar:

**Opción 1: Validación Manual**
Implementa validación en el frontend antes de enviar:
```typescript
async function checkPasswordBreach(password: string): Promise<boolean> {
  const sha1 = await crypto.subtle.digest('SHA-1',
    new TextEncoder().encode(password));
  const hash = Array.from(new Uint8Array(sha1))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  const prefix = hash.substring(0, 5);
  const suffix = hash.substring(5);

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`
  );
  const data = await response.text();

  return data.includes(suffix);
}
```

**Opción 2: Requisitos de Contraseña Fuertes**
Configura reglas estrictas en Authentication → Password Settings:
- Longitud mínima: 12+ caracteres
- Requiere mayúsculas, minúsculas, números y símbolos
- Esto reduce significativamente el riesgo de contraseñas comprometidas

## Otras Mejoras de Seguridad Recomendadas

### 1. Row Level Security (RLS)
✅ **Ya implementado** en todas las tablas del proyecto

### 2. Rate Limiting
Configura límites de intentos en:
- Authentication → Rate Limits
- Previene ataques de fuerza bruta

### 3. Email Confirmación
Activa verificación de email en:
- Authentication → Email → Enable email confirmations

### 4. Multi-Factor Authentication (MFA)
Considera activar MFA para usuarios:
- Authentication → Multi-Factor Auth
- Requiere Plan Pro o superior

### 5. Auditoría de Logs
Revisa regularmente:
- Database → Logs
- Authentication → Logs
- Para detectar actividad sospechosa

## Resumen de Seguridad del Proyecto

✅ **Implementado:**
- RLS habilitado en todas las tablas
- Políticas restrictivas por defecto
- Función `has_memory_permission` protegida contra search_path
- Validación de roles (owner, editor, viewer)
- Verificación de autenticación en Edge Functions

⚠️ **Pendiente (requiere configuración manual):**
- Protección HaveIBeenPwned (requiere Plan Pro)
- Rate limiting (opcional)
- Email confirmation (opcional)
- MFA (opcional, Plan Pro)

## Notas Importantes

🔐 El proyecto tiene una base de seguridad sólida con RLS y políticas adecuadas. Las configuraciones adicionales son opcionales pero recomendadas para producción.

📊 Para aplicaciones en producción con datos sensibles, considera actualizar a Plan Pro para acceder a todas las características de seguridad.
