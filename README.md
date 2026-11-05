# 2L Studio

Site em Next.js da agência de comunicação, marketing e produção audiovisual.

```bash
npm install
npm run dev
```

## Onde mexer

Tudo em `src/content/site.ts`:

- **Contactos**: WhatsApp (o botão "Acção" envia para este número) e redes sociais.
- **Vídeos**: basta colocar o ficheiro em `public/videos` com o nome certo. Se faltar, aparece "Sem sinal".
  - `showreel.mp4`: 16:9, secção logo a seguir à abertura
  - `institucional.mp4`: 16:9 com barras de cinema, ficam visíveis em 2.39:1
  - `reels.mp4`: 9:16, ao lado das artes gráficas
- **Artes**: guarda em `public/posters` e preenche `image` em `posters`.
- **Textos**: serviços, processo e ficha técnica.
