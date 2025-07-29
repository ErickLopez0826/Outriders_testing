# Ejemplo de Uso - Endpoint de Login

## POST /api/login

### Campos Requeridos:
- **email**: Email del usuario (formato: email)
- **password**: Contraseña del usuario

### Ejemplo de Request:

```json
{
  "email": "contacto@loshermanos.com",
  "password": "cliente123"
}
```

### Ejemplo de Response (200 OK):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJjb250YWN0b0Bsb3NoZXJtYW5vcy5jb20iLCJyb2wiOiJjbGllbnRlIiwiY2xpZW50ZUlkIjoxLCJpYXQiOjE3MzI5NjI2NTksImV4cCI6MTczMjk2NjI1OX0.example"
}
```

### Ejemplo de Response (401 Unauthorized):

```json
{
  "mensaje": "Credenciales inválidas"
}
```

### Ejemplo de Response (400 Bad Request):

```json
{
  "mensaje": "Email y password son requeridos"
}
```

## Usuarios Disponibles para Pruebas:

### Cliente:
- **Email**: contacto@loshermanos.com
- **Password**: cliente123
- **Rol**: cliente

### Admin:
- **Email**: admin@apycar.com
- **Password**: admin123
- **Rol**: admin

## Uso con cURL:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contacto@loshermanos.com",
    "password": "cliente123"
  }'
```

## Uso con PowerShell:

```powershell
$body = @{
    email = "contacto@loshermanos.com"
    password = "cliente123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/login" -Method POST -Body $body -ContentType "application/json"
```

## Notas Importantes:

1. **El campo es `email`, NO `username`**
2. **Ambos campos son obligatorios**
3. **El email debe tener formato válido**
4. **La respuesta incluye un token JWT que debe usarse en el header Authorization para endpoints protegidos**
5. **El token expira en 1 hora** 