# AESA Backend

Backend NestJS V1 para el Sistema de Autorizaciones Frio/Calor AESA.

## Estado

El esqueleto del proyecto ya queda armado en este directorio, pero en esta sesion no pude instalar dependencias porque el acceso al registro de `npm` devolvio `403 Forbidden`.

## Instalacion local

```bash
npm install
```

## Variables de entorno

Copiar `.env.example` a `.env` y completar los datos locales.

## Arranque

```bash
npm run start:dev
```

## Modulos incluidos

- `auth`
- `users`
- `requests`
- `documents`
- `printing`
- `history`
- `whatsapp`
- `common`

## Siguiente paso recomendado

1. Instalar dependencias.
2. Levantar la aplicacion.
3. Conectar MySQL.
4. Bajar entidades y servicios sobre la base de las partes 3 a 7.
