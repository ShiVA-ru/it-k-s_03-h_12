# Оптимизация тестов Blogs API

## Обзор

Этот документ описывает оптимизации и улучшения типизации, которые были сделаны в тестах для API блогов.

## Что было изменено

### 1. Выделение Helper функций в отдельный файл

**Файл:** `blogs.test-helpers.ts`

Helper функции были перемещены из основного тестового файла в отдельный модуль для лучшей организации и переиспользования.

#### Типы данных

```typescript
export type PaginatorBlogView = Paginator<BlogView>;

export interface BlogsListResponse {
  body: PaginatorBlogView;
  status: number;
}

export interface BlogResponse {
  body: BlogView;
  status: number;
}
```

#### Построение Paginator

```typescript
// Создание пустого paginator
createEmptyPaginator(): PaginatorBlogView

// Создание paginator с блогами
createPaginatorWithBlogs(blogs: BlogView[], totalCount?: number): PaginatorBlogView
```

#### API Request Helpers

- `getBlogsList(app: Express)` - получить список всех блогов
- `getBlogById(app: Express, id: string)` - получить блог по ID
- `deleteBlog(app: Express, id: string, token: string)` - удалить блог
- `createBlog(app: Express, data, token, expectedStatus)` - создать блог

#### Assertion Helpers

- `assertBlogsListEquals()` - проверить, что список блогов совпадает
- `assertBlogEquals()` - проверить, что блог совпадает
- `assertBlogNotFound()` - проверить, что блог не найден
- `assertDeleteUnauthorized()` - проверить, что удаление без авторизации невозможно
- `assertDeleteSucceeds()` - проверить, что удаление успешно

### 2. Рефакторинг основного тестового файла

**Файл:** `blogs.api.spec.ts`

#### Улучшения структуры

- **Группировка тестов по HTTP методам** — использование `describe()` блоков для организации тестов
- **Лучшая типизация** — использование типов `BlogView` и `BlogInput`
- **Ясные имена переменных** — `blog1`, `blog2` вместо `createdEntity1`, `createdEntity2`
- **Test Data Fixtures** — централизованное определение тестовых данных в объекте `testBlogData`

#### Структура файла

```
1. Импорты
2. Test Suite (describe)
3. State (переменные для хранения состояния между тестами)
4. Test Data Fixtures (объект с данными для тестов)
5. Setup/Teardown (beforeAll, afterAll)
6. Test Cases (grouped by HTTP method)
   - GET /blogs
   - GET /blogs/:id
   - DELETE /blogs/:id
   - POST /blogs
```

### 3. Удаление дублирования

**Было:**
```typescript
const emptyOutputValue: Paginator<BlogView> = {
  items: [],
  pagesCount: 0,
  pageSize: defaultBlogsFilter.pageSize,
  totalCount: 0,
  page: 1,
};
```

**Стало:**
```typescript
await assertBlogsListEquals(app, createEmptyPaginator());
```

### 4. Улучшение читаемости тестов

**Было:**
```typescript
it("should return 200 and empty array", async () => {
  await request(app).get(RouterPath.blogs).expect(200, emptyOutputValue);
});
```

**Стало:**
```typescript
describe("GET /blogs", () => {
  it("should return empty paginated response initially", async () => {
    await assertBlogsListEquals(app, createEmptyPaginator());
  });
});
```

## Преимущества

### 1. Переиспользование кода
- Helper функции могут использоваться в других тестовых файлах
- Меньше дублирования кода

### 2. Лучшая типизация
- Явные типы для API ответов
- IDE поддержка автодополнения

### 3. Лучшая организация
- Логическая группировка тестов по HTTP методам
- Четкое разделение concerns (helpers, тесты, fixtures)

### 4. Улучшенная читаемость
- Ясные имена функций-ассертов
- Меньше boilerplate кода в тестах
- Лучше видно что именно тестируется

### 5. Упрощённое сопровождение
- Если API изменится, нужно обновить только helpers
- Тесты остаются стабильными и понятными

## Примеры использования

### Пример 1: Проверить, что блог существует

```typescript
const { createdEntity } = await blogsTestManager.createEntity(app, data);
await assertBlogEquals(app, createdEntity.id, createdEntity);
```

### Пример 2: Проверить список блогов

```typescript
const { createdEntity: blog1 } = await blogsTestManager.createEntity(app, data1);
const { createdEntity: blog2 } = await blogsTestManager.createEntity(app, data2);

await assertBlogsListEquals(app, createPaginatorWithBlogs([blog2, blog1], 2));
```

### Пример 3: Проверить удаление

```typescript
await assertDeleteSucceeds(app, blog1.id, adminToken);
await assertBlogNotFound(app, blog1.id);
```

## Рекомендации для будущих тестов

1. Используйте `describe()` блоки для группировки тестов по функциональности
2. Определяйте test data в начале файла в объекте `testData` или подобном
3. Используйте assertion helpers вместо прямых проверок
4. Давайте ясные имена переменным и функциям
5. Добавляйте комментарии для сложных проверок

## Файлы

- `blogs.api.spec.ts