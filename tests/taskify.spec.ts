import { test, expect } from '@playwright/test';

// Dados de teste
const TEST_USER = {
  email: `felipe.campos_3${Date.now()}@hotmail.com`, // Email único para cada teste
  password: 'felipe123',
};

const TEST_TASK = {
  title: 'Test Task',
  description: 'This is a test task created during E2E testing.',
};

test.describe('Taskify E2E Tests', () => {
  // Teste 1: Registro de usuário
  test('should register a new user', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Verifica se foi redirecionado para a página de login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

 // Teste 2: Login com sucesso
test('should login successfully', async ({ page }) => {
  // Registro
  await page.goto('/register');
  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');

  // Verifica se o registro foi bem-sucedido
  await expect(page).toHaveURL(/\/login/, { timeout: 15000 });

  // Login
  await page.goto('/login');
  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');

  // Verifica se há mensagem de erro
  const errorMessage = page.locator('text=Erro ao fazer login');
  const hasError = await errorMessage.isVisible();
  if (hasError) {
    console.log('Login failed with error:', await errorMessage.textContent());
    throw new Error('Login failed');
  }

  // Verifica se foi redirecionado para a página de tarefas
  await expect(page).toHaveURL(/\/tasks/, { timeout: 15000 });
  await expect(page.locator('h1')).toHaveText('Minhas Tarefas', { timeout: 10000 });
});

  // Teste 3: Criação de nova tarefa
  test('should create a new task', async ({ page }) => {
    await login(page);
    await page.goto('/tasks');

    // Ajusta os seletores para o idioma em português
    await page.fill('input[placeholder="Digite o título da tarefa"]', TEST_TASK.title);
    await page.fill('textarea[placeholder="Digite a descrição da tarefa"]', TEST_TASK.description);
    await page.click('button[type="submit"]');

    // Verifica se a tarefa foi criada
    await expect(page.locator(`h3:has-text("${TEST_TASK.title}")`)).toBeVisible();
    await expect(page.locator(`p:has-text("${TEST_TASK.description}")`)).toBeVisible();
  });

  // Teste 4: Marcar tarefa como concluída
  test('should mark a task as completed', async ({ page }) => {
    await login(page);
    await page.goto('/tasks');

    await page.fill('input[placeholder="Digite o título da tarefa"]', TEST_TASK.title);
    await page.click('button[type="submit"]');

    // Ajusta para o texto em português
    const taskTitle = page.locator(`h3:has-text("${TEST_TASK.title}")`);
    const markAsCompletedButton = taskTitle.locator('xpath=../..').locator('button:has-text("Marcar como Concluída")');
    await markAsCompletedButton.click();

    // Verifica se o status foi atualizado
    await expect(taskTitle).toHaveClass(/line-through/);
    await expect(page.locator(`p:has-text("Status: completed")`)).toBeVisible();
  });

  // Teste 5: Exclusão de tarefa
  test('should delete a task', async ({ page }) => {
    await login(page);
    await page.goto('/tasks');

    await page.fill('input[placeholder="Digite o título da tarefa"]', TEST_TASK.title);
    await page.click('button[type="submit"]');

    const taskTitle = page.locator(`h3:has-text("${TEST_TASK.title}")`);
    const deleteButton = taskTitle.locator('xpath=../..').locator('button:has-text("Deletar")');
    await deleteButton.click();

    await expect(taskTitle).not.toBeVisible();
  });

  // Teste 6: Filtro por status (pendente/concluída)
  test('should filter tasks by status', async ({ page }) => {
    await login(page);
    await page.goto('/tasks');

    await page.fill('input[placeholder="Digite o título da tarefa"]', 'Pending Task');
    await page.click('button[type="submit"]');

    await page.fill('input[placeholder="Digite o título da tarefa"]', 'Completed Task');
    await page.click('button[type="submit"]');
    const completedTaskTitle = page.locator(`h3:has-text("Completed Task")`);
    const markAsCompletedButton = completedTaskTitle.locator('xpath=../..').locator('button:has-text("Marcar como Concluída")');
    await markAsCompletedButton.click();

    // Ajusta os valores do select para português
    await page.selectOption('select', 'pending');
    await expect(page.locator(`h3:has-text("Pending Task")`)).toBeVisible();
    await expect(page.locator(`h3:has-text("Completed Task")`)).not.toBeVisible();

    await page.selectOption('select', 'completed');
    await expect(page.locator(`h3:has-text("Completed Task")`)).toBeVisible();
    await expect(page.locator(`h3:has-text("Pending Task")`)).not.toBeVisible();
  });

  // Teste 7: Bloqueio de acesso para rotas privadas sem autenticação
  test('should block access to private routes without authentication', async ({ page }) => {
    await page.goto('/tasks', { timeout: 10000 });

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  // Teste 8: Validações de formulário (campos obrigatórios)
  test('should validate form fields', async ({ page }) => {
    await login(page);
    await page.goto('/tasks');

    await page.fill('textarea[placeholder="Digite a descrição da tarefa"]', 'Description without title');
    await page.click('button[type="submit"]');

    await expect(page.locator('p:has-text("Description without title")')).not.toBeVisible();

    await page.goto('/register');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/register/, { timeout: 10000 });
  });

  // Função auxiliar para login
  async function login(page) {
    await page.goto('/register');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
  }
});