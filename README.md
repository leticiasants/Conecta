# Conecta

App mobile para psicólogos acompanharem pacientes entre sessões.

**Stack:** React Native + Expo Router + NativeWind + Firebase

---

## Desenvolvimento local

```bash
npm install
npx expo start
```

---

## Builds (EAS)

### Pré-requisitos (primeira vez)

```bash
npm install -g eas-cli
eas login
```

### APK — para testes diretos no Android

Gera um `.apk` instalável sem precisar da Play Store.

```bash
eas build --platform android --profile preview
```

Para instalar: baixe o `.apk` e ative **"Instalar de fontes desconhecidas"** nas configurações do Android.

### AAB — para publicar na Play Store

Gera o formato exigido pelo Google Play.

```bash
eas build --platform android --profile production
```

### Listar builds e obter link de download

```bash
eas build:list --platform android --limit 5
```

### Ver credenciais (keystore)

```bash
eas credentials
```

---

## Variáveis de ambiente

O `.env` é **gitignored** — nunca sobe para o repositório. É a única fonte de configuração que você precisa editar.

### Configuração inicial

```bash
cp .env.example .env
```

Preencha os valores do Firebase Console no `.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### Sincronizar com o EAS (builds na nuvem)

Os builds remotos não têm acesso ao `.env` local. Após preencher o `.env`, suba as variáveis para o EAS com um comando:

```bash
eas env:push --environment preview
eas env:push --environment production
```

As variáveis ficam armazenadas criptografadas no EAS e são injetadas automaticamente em cada build. O `eas.json` fica limpo, sem valores expostos.

> Sempre que mudar alguma variável no `.env`, rode o `eas env:push` novamente para sincronizar.

---

## Projeto EAS

- Conta: `@lesantoos`
- Projeto: [expo.dev/accounts/lesantoos/projects/conecta](https://expo.dev/accounts/lesantoos/projects/conecta)

---

## Publicar na Play Store (Teste Interno)

### Passo 1 — Gerar o AAB

```bash
eas build --platform android --profile production
```

Ao finalizar, baixe o `.aab` via `eas build:list --platform android --limit 1`.

---

### Passo 2 — Criar conta de desenvolvedor

Acesse [play.google.com/console](https://play.google.com/console) e crie a conta de desenvolvedor.  
Taxa única de **$25**.

---

### Passo 3 — Criar o app no Play Console

1. Clique em **Criar aplicativo**
2. Preencha:
   - Nome: `Conecta`
   - Idioma padrão: `Português (Brasil)`
   - Tipo: `Aplicativo`
   - Pago/Gratuito: `Gratuito`
3. Aceite as políticas e clique em **Criar app**

---

### Passo 4 — Preencher obrigatórios

O Google bloqueia o upload se qualquer item abaixo estiver faltando.

#### Política de privacidade
- Crie uma página pública com a política (GitHub Pages, Notion, etc.)
- Play Console → Conteúdo do app → Política de privacidade → cole a URL
- O app trata dados de saúde mental — a política é **obrigatória**

#### Segurança de dados
Play Console → Conteúdo do app → **Segurança de dados**

Declare:
- Coleta **e-mail** (para criação de conta)
- Coleta **dados inseridos pelo usuário** (registros emocionais)
- Não compartilha dados com terceiros
- Usa **Firebase (Google)** como processador de dados

#### Classificação etária
Play Console → Conteúdo do app → **Classificação do conteúdo** → preencher questionário IARC (~5 min)

#### Categoria
Play Console → Presença na Play Store → Informações do app → **Categoria: Saúde e Fitness**

---

### Passo 5 — Upload do AAB

1. Play Console → **Teste → Testes internos → Criar nova versão**
2. Clique em **Fazer upload** e selecione o `.aab`
3. Preencha as novidades da versão (ex: `Versão inicial para teste`)
4. Clique em **Salvar** e depois **Revisar versão**
5. Clique em **Iniciar lançamento para Testes internos**

---

### Passo 6 — Adicionar testadores

1. Play Console → Teste → Testes internos → aba **Testadores**
2. Crie uma lista de e-mails com os testadores
3. Salve — cada testador recebe um **link de opt-in** para instalar via Play Store

Limite: **100 testadores internos**, sem revisão do Google, disponível em minutos.
