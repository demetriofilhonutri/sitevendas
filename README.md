# DF Ferramentas — prévia independente

Página de vendas em português. Nenhuma alteração foi feita nos aplicativos originais. Não publicada. `noindex,nofollow` permanece ativo.

## Desenvolvimento

Node 24; `npm ci --cache /tmp/npm-cache`; `npm run dev`.
Produção: `npm run build`. O build usa caminhos relativos e pode ser hospedado em `/ferramentas/`.
Validação: `npm test`. Usa Chromium do ambiente em `/usr/bin/chromium`.

## Configuração comercial

Edite apenas `config.js` para preços numéricos em BRL, pagamento, prazo, checkout HTTPS, entrega, requisitos para pacientes, links legais, atendimento e foto real. Ausência de checkout mantém ações claramente identificadas como demonstração. Economia somente com os três preços definidos e combo inferior à soma. Nunca insira credenciais.

`cta_click`, `product_recommendation` e `begin_checkout` são preparados em `window.dataLayer` e no evento `df:analytics`. O último só ocorre com checkout HTTPS configurado. Nenhum provedor de analytics foi instalado; consentimento e integração devem ser definidos antes da publicação.

## Fontes e pendências de publicação

- Filtro de Receitas: leitura do repositório público `demetriofilhonutri/receitasnutri`, commit `940b557488bd69936224b3877516547ac389eab6`. Filtros, PDF e exemplo Crepioca confirmados no código. `public/filtro-real.png` é uma captura da seção `.filters` da cópia local sem mudanças no original. Não há fotos de receitas na base consultada.
- Sites oficiais não acessíveis pela política de rede desta sessão. DF Assist não verificado: sem resultados de substituição inventados; mockup explicitamente conceitual. Antes de publicar, confirmar funcionalidades e capturar tela real com exemplo de arroz.
- Confirmar preços, checkouts, prazo, entrega, acesso de não pacientes, dados comerciais, atendimento e políticas reais. Inserir fotografia autorizada.
- `public/social.svg` é uma arte própria de compartilhamento. Converter para PNG/JPEG no domínio final e atualizar `og:image` antes de publicar (compatibilidade social). Configurar URL canônica, robots e metadados finais somente após autorização. `config.published` é metadado informativo, não publica nem remove noindex.
- Tipografia usa Google Fonts com fallback local; página funciona sem a requisição externa.
- Não há servidor de pagamentos ou backend neste projeto.

A prévia não está pronta para vendas públicas enquanto essas pendências permanecerem. A publicação do site depende de autorização explícita do proprietário, separadamente da configuração do ambiente.

## Prévia pelo GitHub Pages

Workflow `.github/workflows/preview-pages.yml`: compila a branch `main` e publica apenas o build estático, sem domínio personalizado. No GitHub, selecione **Settings → Pages → Build and deployment → Source: GitHub Actions**. Depois execute **Actions → Publicar prévia no GitHub Pages → Run workflow** caso o envio inicial tenha ocorrido antes dessa seleção. A URL é fornecida pelo job de deploy; o endereço esperado é `https://demetriofilhonutri.github.io/sitevendas/`. Só considerar online após o workflow concluir. A prévia conserva `noindex`; não é uma oferta com pagamentos habilitados.

## Capturas e vídeo do Filtro de Receitas

`public/media/proveniencia.json` registra a origem e o fluxo. As imagens e o vídeo de 13,5 segundos mostram a execução local intacta do commit público informado. Não são capturas do site online: os dois domínios estavam bloqueados na sessão. Recursos externos (fontes, logotipo e bibliotecas PDF) não foram carregados; nenhum recurso foi substituído por dados simulados. O vídeo mostra busca, filtros e detalhes, sem áudio e sem exportação PDF. Há descrição textual acessível junto ao player. `scripts/capture-recipes.mjs` reproduz a captura com RECIPES_SOURCE apontando para um checkout temporário fora deste repositório. A codificação utiliza ffmpeg, H.264, yuv420p e faststart.
