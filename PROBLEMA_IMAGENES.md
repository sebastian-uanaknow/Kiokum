# Problema: Imágenes no se visualizan

## ¿Por qué no se ven las imágenes?

Las imágenes que subiste tienen URLs del proyecto antiguo de Supabase:
```
https://fszaxmsqssqnliupcrpf.supabase.co/storage/...
```

Pero tu nuevo proyecto es:
```
https://auyildrnvgmkfhqsdkwu.supabase.co/storage/...
```

## Solución

Para que las **NUEVAS** imágenes que subas funcionen correctamente:

### 1. Obtén tu ANON_KEY del proyecto nuevo

Ve a: https://supabase.com/dashboard/project/auyildrnvgmkfhqsdkwu/settings/api

Copia la **anon / public** key (empieza con `eyJ...`)

### 2. Actualiza el archivo `.env`

Abre el archivo `.env` y pega tu ANON_KEY donde dice:
```
VITE_SUPABASE_ANON_KEY=PEGA_TU_ANON_KEY_AQUI
```

### 3. Reinicia la aplicación

Una vez que actualices el `.env`, las nuevas imágenes que subas se guardarán en el proyecto correcto y se visualizarán sin problemas.

## ¿Qué pasa con las imágenes antiguas?

Las imágenes que ya subiste están en el proyecto antiguo y no se pueden visualizar. Tendrías que:

1. Volver a subirlas en la aplicación una vez que actualices el `.env`, o
2. Migrar manualmente los archivos del storage antiguo al nuevo (más complicado)

## Resumen

- ✅ El código está bien implementado
- ✅ El storage bucket está configurado correctamente
- ✅ Las políticas RLS están correctas
- ❌ El `.env` necesita la ANON_KEY del proyecto nuevo
- ❌ Las imágenes existentes apuntan al proyecto antiguo
