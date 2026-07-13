# DynamicZoneRenderer

Компонент для динамического рендеринга блоков контента на основе схемы компонентов. Позволяет гибко отображать различные секции страницы, получая данные из CMS или других источников.

## Описание

`DynamicZoneRenderer` принимает массив блоков данных и схему соответствия типов блоков React-компонентам, затем рендерит соответствующие компоненты с переданными данными.

## Props

### `blocksData?: BlockWithIdAndComponent[]`

Массив объектов блоков для рендеринга. Каждый блок должен содержать:
- `id: number` - уникальный идентификатор блока
- `__component: string` - тип компонента (должен соответствовать ключу в `blocksSchema`)
- `sectionId?: string` - опциональный идентификатор секции
- Любые другие поля, которые будут переданы в компонент как props

### `blocksSchema: Record<string, React.ComponentType<any>>`

Объект-схема, где ключи - это типы компонентов (например, `"sections.faq-section"`), а значения - React-компоненты для рендеринга.

### `additionalData?: Record<string, object>`

Опциональный объект для передачи дополнительных данных конкретным блокам. Ключи должны соответствовать типам компонентов из `blocksSchema`, значения - объекты с props, которые будут мержиться с данными блока.

## Типы

```typescript
type BlockWithIdAndComponent = {
  id: number;
  __component: string;
  sectionId?: string;
  [key: string]: unknown;
};

interface DynamicZoneRendererProps {
  blocksData?: BlockWithIdAndComponent[];
  blocksSchema: Record<string, React.ComponentType<any>>;
  additionalData?: Record<BlockWithIdAndComponent["__component"], object>;
}
```

## Пример использования

```tsx
import { DynamicZoneRenderer } from '@/shared/ui/dynamic-zone-renderer';
import BlogSection from '@/components/sections/BlogSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ServicesSection from '@/components/sections/ServicesSection';
// ... другие компоненты секций

// Определение схемы компонентов
const blocksSchema = {
  "sections.service-section-with-subtitle": ServicesSection,
  "sections.projects-section": ProjectsSection,
  "sections.blog-section": BlogSection,
  "sections.clients-section": ClientSection,
  "sections.principles-section": PrinciplesSection,
  "sections.how-we-work-section": HowWeWorkSection,
  ...
};

// Использование компонента
<DynamicZoneRenderer
  additionalData={{
    "sections.how-we-work-section": {
      bgText: servicePage?.hero?.bgText,
    },
    "sections.projects-section": {
      sectionId: null,
    },
  }}
  blocksData={servicePage?.blocks as BlockWithIdAndComponent[]}
  blocksSchema={blocksSchema}
/>
```

## Как это работает

1. Компонент итерируется по массиву `blocksData`
2. Для каждого блока извлекается `__component` (тип компонента)
3. По типу находится соответствующий компонент в `blocksSchema`
4. Если компонент не найден, блок пропускается
5. Компонент рендерится с:
   - `key={block.id}` - для React key
   - `sectionId` - извлекается из последней части `__component` (после последней точки)
   - Данными из `additionalData[blockUid]` (если есть)
   - Всеми остальными данными из объекта блока

## Особенности

- **Автоматический `sectionId`**: Компонент автоматически извлекает `sectionId` из последней части `__component`. Например, для `"sections.faq-section"` будет передано `sectionId="faq-section"`
- **Мержинг данных**: Данные из `additionalData` мержатся с данными блока, при этом `additionalData` имеет приоритет
- **Безопасность**: Если компонент не найден в схеме, блок просто не рендерится (возвращается `null`)

## Пример данных блока

```typescript
const exampleBlock: BlockWithIdAndComponent = {
  id: 1,
  __component: "sections.faq-section",
  sectionId: "faq", // опционально
  title: "Часто задаваемые вопросы",
  items: [
    { question: "Вопрос 1?", answer: "Ответ 1" },
    { question: "Вопрос 2?", answer: "Ответ 2" },
  ],
};
```

## Лучшие практики

1. **Типизация схемы**: Рекомендуется создать типизированную схему для лучшей поддержки TypeScript:
   ```typescript
   const blocksSchema: Record<string, React.ComponentType<any>> = {
     // ...
   };
   ```

2. **Обработка отсутствующих компонентов**: Убедитесь, что все типы блоков из `blocksData` присутствуют в `blocksSchema`, иначе они не будут отрендерены

3. **Использование `additionalData`**: Используйте `additionalData` для передачи контекстных данных, которые не приходят из CMS, но нужны компонентам (например, данные из родительского компонента)

4. **Производительность**: Компонент использует `id` блока как `key`, что обеспечивает правильную работу React при обновлениях списка
