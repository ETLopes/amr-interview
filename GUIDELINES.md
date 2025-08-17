Simulador Estratégico de Compra de Imóvel aMORA — Nível Sênior
Objetivo: Avaliar a proficiência em arquitetura de software, tomada de decisões técnicas
estratégicas e a capacidade de alinhar soluções de engenharia com os objetivos de negócio
da aMORA.
Contexto: Desenvolver um simulador de compra de imóveis completo, considerando a
experiência de um usuário real da aMORA.
Instrução: Implemente uma solução full-stack utilizando as seguintes tecnologias:
● Front-end: React/Next.js
● Back-end: FastAPI (preferencial) ou Node.js
● Banco de Dados: PostgreSQL
● Infraestrutura: Docker Compose para orquestração de todos os serviços.
A solução deve ser entregue como um repositório público no GitHub, contendo instruções
claras para execução local via Docker Compose e um documento em Markdown com a
análise de negócio e decisões técnicas.
Requisitos Mínimos:API Robusta:
● CRUD de Simulações: Implementar as operações de Create, Read, Update e
Delete para simulações de compra de imóveis.
○ Incluir um sistema de autenticação simples (ex: login/senha em memória
para fins de teste).
● Histórico de Simulações: Cada simulação deve estar vinculada ao usuário que a
criou, permitindo rastrear o histórico individual.
Front-end:
● Formulário de Simulação Completo: Criar um formulário intuitivo para que o
usuário possa inserir todos os dados necessários para a simulação (ex: valor do
imóvel, percentual de entrada, anos de contrato).
● Lista de Simulações do Usuário: Exibir uma lista das simulações previamente
criadas pelo usuário autenticado.
● Experiência do Cliente aMORA: Priorizar a usabilidade, com um layout responsivo
e foco na experiência do cliente. A interface deve ser visualmente agradável e de
fácil navegação.
Banco de Dados:
● Estrutura de Dados: Definir e implementar um esquema de banco de dados
adequado para armazenar informações de usuários e simulações. Considerar a
escalabilidade e a integridade dos dados.
Análise e Estratégia de Negócio (Documento Markdown):
Este documento desempenha um papel fundamental na análise da sua perspectiva
estratégica e na sua aptidão para harmonizar a solução técnica proposta com as metas e
prioridades de negócio da organização. A sua elaboração cuidadosa é essencial, pois ele
deverá detalhar de forma clara e concisa os seguintes aspetos:
● Decisões Técnicas Justificadas: Explique as escolhas arquiteturais, as tecnologias
selecionadas e as decisões de design do sistema. Detalhe os trade-offs
considerados e a razão por trás de cada decisão.
● Sugestões de Features de Negócio: Proponha funcionalidades que agreguem
valor ao objetivo de negócio da aMORA, com foco em melhorar a experiência do
usuário e gerar insights relevantes. Exemplos:
○ Score automático de elegibilidade para crédito imobiliário.
○ Integração futura com portais de imóveis para importar dados ou comparar
simulações com ofertas reais.
○ Relatórios de simulações personalizáveis para o usuário.
○ Funcionalidade de exportação do histórico de simulações.
○ Métricas de engajamento dos usuários com o simulador (ex: tempo de uso,
número de simulações criadas).
● Métricas de Sucesso: Defina métricas claras e mensuráveis para avaliar o sucesso
da implementação do simulador e seu impacto no negócio da aMORA. Exemplos:
○ Taxa de conversão de simulações em contratos de compra de imóveis.
○ Tempo médio gasto pelos usuários na ferramenta de simulação.
○ Taxa de retenção de usuários que utilizam o simulador.
○ Número de simulações criadas por usuário.
Fórmulas de Cálculo:
● Valor da Entrada: `valor_imovel * (percentual_entrada / 100)`
● Valor a Financiar: `valor_imovel - valor_entrada`
● Total a Guardar (15% do valor do imóvel para custos adicionais): `valor_imovel *
0.15`
● Valor Mensal de Poupança (para atingir o total a guardar): `total_a_guardar /
(anos_contrato * 12)`
Entrega:
● Repositório GitHub: Um único repositório público contendo todo o código-fonte da
aplicação (front-end, back-end, banco de dados) e o arquivo `docker-compose.yml`
para executar todos os serviços.
● Instruções de Execução: Documentação clara e concisa (no README do
repositório) de como executar a aplicação localmente utilizando o Docker Compose.
● Documento de Análise de Negócio: Um arquivo em formato Markdown
(`README.md` ou um arquivo separado) na raiz do repositório contendo a análise
das decisões técnicas e as sugestões de features e métricas de sucesso.
Expectativas de um Senior Engineer:
● Visão Sistêmica: Compreensão profunda de como os diferentes componentes da
solução interagem e se integram.
● Qualidade do Código: Código limpo, bem estruturado, legível e aderente às
melhores práticas de desenvolvimento para cada tecnologia.
● Escalabilidade e Manutenibilidade: Considerações sobre como a aplicação pode
ser escalada no futuro e a facilidade de manutenção e evolução do código.
● Testabilidade: Estratégias para garantir a qualidade e a confiabilidade da aplicação
através de testes automatizados (unitários, de integração, etc. - mesmo que básicos
dentro do tempo sugerido).
● Comunicação e Documentação: Clareza na comunicação das decisões técnicas e
na documentação da solução para facilitar o entendimento por outros membros da
equipe.
● Alinhamento com o Negócio: Demonstração de como a solução técnica proposta
contribui para os objetivos estratégicos da aMORA e como as sugestões de features
podem gerar valor real para o negócio.
Tempo Sugerido: 5 a 10 horas
Este teste visa avaliar não apenas suas habilidades de codificação, mas principalmente sua
capacidade de pensar estrategicamente sobre a solução, considerando os aspectos
técnicos e de negócio de um produto digital.