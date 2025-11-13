# Componentes de la Arquitectura Hexagonal

## 📋 Índice

1. [Introducción](#introducción)
2. [Componentes por Capa](#componentes-por-capa)
3. [Flujo de Datos Completo](#flujo-de-datos-completo)
4. [Ejemplos Prácticos](#ejemplos-prácticos)
5. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

Este documento explica de forma sencilla qué hace cada componente de la arquitectura hexagonal del proyecto y cómo trabajan juntos para procesar datos desde las APIs externas hasta la presentación en la UI.

### ¿Por qué Arquitectura Hexagonal?

La arquitectura hexagonal (también llamada "Puertos y Adaptadores") separa la **lógica de negocio** (dominio) de los **detalles técnicos** (infraestructura). Esto permite:

- ✅ Cambiar APIs sin afectar el código de negocio
- ✅ Cambiar la UI sin afectar el dominio
- ✅ Testear fácilmente cada componente
- ✅ Reutilizar el dominio en diferentes plataformas

---

## Componentes por Capa

### 🏛️ Domain Layer (Capa de Dominio)

El núcleo de la aplicación. Contiene la lógica de negocio pura, sin dependencias externas.

#### Entities (Entidades)

**¿Qué son?** Representan conceptos del negocio con identidad única.

**Ejemplo:**

```typescript
// src/features/podcasts/domain/entities/Podcast.ts
export interface Podcast {
  id: string; // Identificador único
  title: string; // Título del podcast
  author: string; // Autor del podcast
  imageUrl: string; // URL de la imagen
  summary: string; // Descripción del podcast
}
```

**¿Qué hacen?**

- Definen la estructura de datos del negocio
- Son independientes de APIs o frameworks
- Pueden contener lógica de negocio simple

**En la arquitectura:**

- Son el "modelo puro" del dominio
- No conocen React, APIs, ni localStorage
- Pueden reutilizarse en cualquier plataforma

#### Repository Interfaces (Puertos)

**¿Qué son?** Contratos que definen QUÉ operaciones se pueden hacer, no CÓMO.

**Ejemplo:**

```typescript
// src/features/podcasts/domain/repositories/PodcastRepository.ts
export interface IPodcastRepository {
  getTopPodcasts(): Promise<Podcast[]>;
  getPodcastDetail(podcastId: string): Promise<PodcastDetail>;
}
```

**¿Qué hacen?**

- Definen las operaciones disponibles
- No tienen implementación (solo interfaz)
- Son "puertos" que esperan un "adaptador"

**En la arquitectura:**

- Son la "puerta" del dominio hacia el exterior
- La infraestructura los implementa (adaptadores)
- El dominio depende de abstracciones, no de implementaciones

#### Domain Services (Servicios de Dominio)

**¿Qué son?** Lógica de negocio compleja que no pertenece a una entidad específica.

**Características:**

- Implementan reglas de negocio complejas
- Operan sobre múltiples entidades
- Contienen lógica que no es responsabilidad de una entidad
- **Importante:** Solo trabajan con entidades del dominio, nunca con DTOs de otras capas

**En la arquitectura:**

- Pertenecen al dominio (lógica de negocio pura)
- Pueden ser usados por casos de uso
- Son independientes de infraestructura y aplicación
- **No pueden depender de capas externas (Application, Infrastructure, Presentation)**

---

### 🔄 Application Layer (Capa de Aplicación)

Orquesta la lógica de negocio, conectando el dominio con la infraestructura y la presentación.

#### Use Cases (Casos de Uso)

**¿Qué son?** Orquestadores que coordinan el flujo de datos entre capas y pueden contener lógica simple de aplicación.

**Ejemplo 1: Orquestación simple**

```typescript
// src/features/podcasts/application/use-cases/GetTopPodcasts.ts
export class GetTopPodcasts {
  constructor(private readonly repository: IPodcastRepository) {}

  async execute(): Promise<Podcast[]> {
    return this.repository.getTopPodcasts();
  }
}
```

**Ejemplo 2: Lógica de aplicación (filtrado, transformación)**

```typescript
// src/features/podcasts/application/use-cases/FilterPodcasts.ts
export class FilterPodcasts {
  execute(podcasts: Podcast[], searchTerm: string): Podcast[] {
    // Lógica simple de filtrado para la UI
    // No es lógica de negocio compleja, solo transformación/presentación
    const normalizedTerm = searchTerm.trim().toLowerCase();
    return podcasts.filter((podcast) => {
      return (
        podcast.title.toLowerCase().includes(normalizedTerm) ||
        podcast.author.toLowerCase().includes(normalizedTerm)
      );
    });
  }
}
```

**¿Qué hacen?**

- Coordinan operaciones del negocio
- Usan repositorios para obtener datos
- Pueden contener lógica simple de aplicación (filtrado, transformación)
- Pueden combinar múltiples operaciones
- No contienen lógica de negocio compleja (esa va en Domain Services)

**En la arquitectura:**

- Son el "controlador" de la lógica de aplicación
- Conectan dominio con infraestructura
- Son usados por hooks de React
- Pueden trabajar con entidades del dominio o DTOs

#### DTOs (Data Transfer Objects)

**¿Qué son?** Objetos optimizados para transferir datos entre capas.

**Ejemplo:**

```typescript
// src/features/podcasts/application/dtos/podcast/PodcastCardDTO.ts
export interface PodcastCardDTO {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  // NO incluye 'summary' para reducir memoria
}
```

**¿Qué hacen?**

- Transportan datos optimizados para la UI
- Excluyen campos pesados cuando no son necesarios
- Reducen el uso de memoria
- Facilitan la transferencia entre capas

**En la arquitectura:**

- Son el "idioma común" entre application y presentation
- Optimizados para mostrar datos en la UI
- Evitan pasar entidades completas cuando solo se necesitan algunos campos

#### Application Services (Servicios de Aplicación)

**¿Qué son?** Servicios que convierten entidades del dominio a DTOs.

**Ejemplo:**

```typescript
// src/features/podcasts/application/services/podcast/PodcastCardService.ts
export class PodcastCardService {
  mapToCardDTOs(podcasts: Podcast[]): PodcastCardDTO[] {
    return mapPodcastsToCardDTOs(podcasts);
  }
}
```

**¿Qué hacen?**

- Convierten entidades de dominio a DTOs
- Optimizan datos para la presentación
- Actúan como adaptadores entre dominio y presentación
- No manejan datos ni caché (solo transformación)

**En la arquitectura:**

- Son el "traductor" entre dominio y presentación
- Transforman datos del dominio a formato UI
- Mantienen el dominio independiente de la presentación

#### Mappers (Application Layer)

**¿Qué son?** Funciones que transforman entidades del dominio a DTOs.

**Ejemplo:**

```typescript
// src/features/podcasts/application/mappers/podcastCardMapper.ts
export const mapPodcastToCardDTO = (podcast: Podcast): PodcastCardDTO => ({
  id: podcast.id,
  imageUrl: podcast.imageUrl,
  title: podcast.title,
  author: podcast.author,
  // Excluye 'summary' para optimizar
});
```

**¿Qué hacen?**

- Convierten una entidad a un DTO
- Seleccionan solo los campos necesarios
- Reducen el tamaño de los datos
- Optimizan para la presentación

**En la arquitectura:**

- Pertenecen a la capa de aplicación (Domain → DTO)
- Solo transforman datos, no los obtienen
- Son usados por servicios de aplicación

---

### 🔌 Infrastructure Layer (Capa de Infraestructura)

Implementa las conexiones con el mundo exterior (APIs, caché, almacenamiento).

#### Repository Implementations (Adaptadores)

**¿Qué son?** Implementaciones concretas de los repositorios del dominio.

**Ejemplo:**

```typescript
// src/features/podcasts/infrastructure/repositories/ITunesPodcastRepository.ts
export class ITunesPodcastRepository implements IPodcastRepository {
  async getTopPodcasts(): Promise<Podcast[]> {
    const response = await iTunesPodcastClient.getTopPodcasts();
    return mapToPodcastList(response); // Convierte API → Domain
  }
}
```

**¿Qué hacen?**

- Implementan las interfaces del dominio
- Conectan con APIs externas
- Convierten datos de API a entidades del dominio
- Manejan detalles técnicos (HTTP, errores, etc.)

**En la arquitectura:**

- Son "adaptadores" que conectan el dominio con APIs
- Implementan los "puertos" definidos en el dominio
- Transforman datos externos (API) a formato interno (Domain)

#### API Clients (Clientes de API)

**¿Qué son?** Clientes que hacen peticiones HTTP a APIs externas.

**Ejemplo:**

```typescript
// src/features/podcasts/infrastructure/api/ITunesPodcastClient.ts
export class ITunesPodcastClient {
  async getTopPodcasts(): Promise<TopPodcastsResponse> {
    const url = buildTopPodcastsFeedUrl();
    return this.client.get<TopPodcastsResponse>(url, false);
  }
}
```

**¿Qué hacen?**

- Hacen peticiones HTTP a APIs externas
- Manejan detalles de comunicación (URLs, headers, etc.)
- Retornan respuestas en formato de API
- No conocen el dominio (solo APIs)

**En la arquitectura:**

- Son el "puente" con APIs externas
- Trabajan con formatos de API (no dominio)
- Son usados por repositorios de infraestructura

#### Mappers (Infrastructure Layer)

**¿Qué son?** Funciones que transforman datos de API a entidades del dominio.

**Ejemplo:**

```typescript
// src/features/podcasts/infrastructure/mappers/podcastMapper.ts
export const mapToPodcastList = (response: TopPodcastsResponse): Podcast[] => {
  const entries = response.feed?.entry ?? [];
  return entries.map((entry) => mapFeedEntryToPodcast(entry));
};
```

**¿Qué hacen?**

- Convierten respuestas de API a entidades del dominio
- Normalizan datos de diferentes fuentes
- Manejan valores por defecto y validaciones
- Transforman formatos externos a formatos internos

**En la arquitectura:**

- Pertenecen a la capa de infraestructura (API → Domain)
- Convierten datos externos a formato del dominio
- Son usados por repositorios de infraestructura

#### Cache Services (Servicios de Caché)

**¿Qué son?** Servicios que almacenan datos temporalmente para mejorar el rendimiento.

**Ejemplo:**

```typescript
// src/features/podcasts/infrastructure/cache/PodcastCache.ts
export class PodcastCache {
  getTopPodcasts(): Podcast[] | null {
    return this.cache.get<Podcast[]>(TOP_PODCASTS_KEY);
  }

  setTopPodcasts(podcasts: Podcast[]): void {
    this.cache.set(TOP_PODCASTS_KEY, podcasts, PODCAST_CACHE_TTL_MS);
  }
}
```

**¿Qué hacen?**

- Almacenan datos en localStorage (o otro almacenamiento)
- Reducen peticiones a APIs
- Mejoran el rendimiento de la aplicación
- Manejan serialización/deserialización

**En la arquitectura:**

- Son "adaptadores" de almacenamiento
- Implementan estrategias de caché
- Son usados por hooks y casos de uso

---

### 🎨 Presentation Layer (Capa de Presentación)

Muestra datos al usuario y maneja la interacción.

#### Custom Hooks (Hooks Personalizados)

**¿Qué son?** Hooks de React que conectan la UI con los casos de uso.

**Ejemplo:**

```typescript
// src/features/podcasts/presentation/hooks/useTopPodcasts.ts
export const useTopPodcasts = (): UseTopPodcastsState => {
  const getTopPodcasts = getGetTopPodcasts();

  const { data, isLoading } = useUseCaseQuery<Podcast[]>({
    key: 'top-podcasts',
    execute: () => getTopPodcasts.execute(),
    cache: {
      read: () => podcastCache.getTopPodcasts(),
      write: (podcasts: Podcast[]) => podcastCache.setTopPodcasts(podcasts),
    },
  });

  return { podcasts: data ?? [], isLoading };
};
```

**¿Qué hacen?**

- Conectan React con casos de uso
- Gestionan el estado de carga
- Manejan caché y actualizaciones
- Proporcionan datos a componentes

**En la arquitectura:**

- Son el "puente" entre React y la lógica de aplicación
- Usan casos de uso para obtener datos
- Gestionan estado de UI (loading, error, etc.)

#### React Components (Componentes de React)

**¿Qué son?** Componentes que muestran datos en la UI.

**Ejemplo:**

```typescript
// src/features/podcasts/presentation/components/PodcastCard/PodcastCard.tsx
export const PodcastCard = memo(({ podcast }: PodcastCardProps) => {
  return (
    <Link to={buildPodcastDetailRoute(podcast.id)}>
      <article className="podcast-card">
        <img src={podcast.imageUrl} alt={podcast.title} />
        <h3>{podcast.title}</h3>
        <p>Author: {podcast.author}</p>
      </article>
    </Link>
  );
});
```

**¿Qué hacen?**

- Muestran datos en la UI
- Manejan la interacción del usuario
- Son componentes "puros" (solo presentación)
- No contienen lógica de negocio

**En la arquitectura:**

- Son la "cara" de la aplicación
- Reciben datos de hooks
- Muestran información al usuario
- No conocen el dominio directamente

---

## Diagrama de Arquitectura Hexagonal

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (React Components, Hooks, Pages)                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Components:                                       │    │
│  │  - PodcastCard.tsx                                 │    │
│  │  - PodcastList.tsx                                 │    │
│  │  - PodcastFilter.tsx                               │    │
│  │                                                     │    │
│  │  Hooks:                                            │    │
│  │  - useTopPodcasts()                                │    │
│  │  - useFilteredPodcasts()                           │    │
│  │  - usePodcastDetail()                              │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │ uses
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  (Use Cases, DTOs, Services, Mappers Domain→DTO)           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Use Cases:                                        │    │
│  │  - GetTopPodcasts                                  │    │
│  │  - FilterPodcasts (filtrado para UI)              │    │
│  │  - GetPodcastDetail                                │    │
│  │                                                     │    │
│  │  Services:                                         │    │
│  │  - PodcastCardService                              │    │
│  │  - PodcastDetailService                            │    │
│  │                                                     │    │
│  │  DTOs:                                             │    │
│  │  - PodcastCardDTO                                  │    │
│  │  - PodcastDetailDTO                                │    │
│  │  - EpisodeListItemDTO                              │    │
│  │                                                     │    │
│  │  Mappers (Domain → DTO):                           │    │
│  │  - podcastCardMapper                               │    │
│  │  - podcastDetailMapper                             │    │
│  │  - episodeListItemMapper                           │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │ uses
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                             │
│  (Entities, Repository Interfaces, Domain Services)         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Entities:                                         │    │
│  │  - Podcast                                         │    │
│  │  - Episode                                         │    │
│  │  - PodcastDetail                                   │    │
│  │                                                     │    │
│  │  Repository Interfaces (Ports):                    │    │
│  │  - IPodcastRepository                              │    │
│  │                                                     │    │
│  │  Domain Services:                                  │    │
│  │  - (Lógica de negocio compleja)                    │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │ implemented by
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                         │
│  (Repository Implementations, API Clients,                  │
│   Mappers API→Domain, Cache)                                │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Repository Implementations (Adapters):            │    │
│  │  - ITunesPodcastRepository                         │    │
│  │                                                     │    │
│  │  API Clients:                                      │    │
│  │  - ITunesPodcastClient                             │    │
│  │  - FeedContentClient                               │    │
│  │                                                     │    │
│  │  Mappers (API → Domain):                           │    │
│  │  - podcastMapper                                   │    │
│  │  - episodeMapper                                   │    │
│  │                                                     │    │
│  │  Cache:                                            │    │
│  │  - PodcastCache                                    │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │ connects to
                     ▼
              ┌──────────────┐
              │ iTunes API   │
              │ RSS Feeds    │
              │ localStorage │
              └──────────────┘
```

---

## Flujo de Datos Completo

### Ejemplo: Mostrar Lista de Podcasts

```
1. Usuario visita la página
   ↓
2. Componente PodcastsPage se renderiza
   ↓
3. Hook useTopPodcasts() se ejecuta
   ↓
4. Hook usa caso de uso GetTopPodcasts
   ↓
5. Caso de uso llama a repository.getTopPodcasts()
   ↓
6. Repository (infrastructure) llama a iTunesPodcastClient
   ↓
7. Client hace petición HTTP a iTunes API
   ↓
8. Client recibe respuesta de API (formato JSON)
   ↓
9. Mapper (infrastructure) convierte API response → Podcast entities
   ↓
10. Repository retorna Podcast[] al caso de uso
   ↓
11. Caso de uso retorna Podcast[] al hook
   ↓
12. Hook almacena en caché (localStorage)
   ↓
13. Hook retorna { podcasts, isLoading } al componente
   ↓
14. Componente renderiza lista de podcasts
```

### Ejemplo: Filtrar Podcasts

```
1. Usuario escribe en el campo de búsqueda
   ↓
2. Componente PodcastFilter actualiza searchTerm
   ↓
3. Hook useFilteredPodcasts(searchTerm) se ejecuta
   ↓
4. Hook obtiene podcasts de useTopPodcasts()
   ↓
5. Hook usa caso de uso FilterPodcasts
   ↓
6. Caso de uso filtra podcasts por título y autor (lógica simple)
   ↓
7. Caso de uso retorna podcasts filtrados al hook
   ↓
8. Hook retorna { podcasts, filteredCount } al componente
   ↓
9. Componente muestra podcasts filtrados
```

### Ejemplo: Convertir Podcasts a DTOs

```
1. Hook useTopPodcasts() obtiene Podcast[] del dominio
   ↓
2. Hook necesita convertir a PodcastCardDTO[] para la UI
   ↓
3. Hook usa PodcastCardService
   ↓
4. Service usa podcastCardMapper
   ↓
5. Mapper convierte cada Podcast → PodcastCardDTO
   (excluye 'summary' para reducir memoria)
   ↓
6. Service retorna PodcastCardDTO[] al hook
   ↓
7. Hook retorna DTOs al componente
   ↓
8. Componente muestra solo los campos del DTO
```

---

## Ejemplos Prácticos

### Caso 1: Obtener Top Podcasts

**Flujo completo:**

```typescript
// 1. Presentation Layer - Hook
export const useTopPodcasts = () => {
  const getTopPodcasts = getGetTopPodcasts(); // Obtiene caso de uso

  const { data } = useUseCaseQuery({
    execute: () => getTopPodcasts.execute(), // Usa caso de uso
  });

  return { podcasts: data ?? [] };
};

// 2. Application Layer - Use Case
export class GetTopPodcasts {
  constructor(private repository: IPodcastRepository) {}

  async execute(): Promise<Podcast[]> {
    return this.repository.getTopPodcasts(); // Usa repositorio
  }
}

// 3. Domain Layer - Repository Interface
export interface IPodcastRepository {
  getTopPodcasts(): Promise<Podcast[]>; // Define contrato
}

// 4. Infrastructure Layer - Repository Implementation
export class ITunesPodcastRepository implements IPodcastRepository {
  async getTopPodcasts(): Promise<Podcast[]> {
    const response = await iTunesPodcastClient.getTopPodcasts(); // Llama API
    return mapToPodcastList(response); // Convierte API → Domain
  }
}

// 5. Infrastructure Layer - API Client
export class ITunesPodcastClient {
  async getTopPodcasts(): Promise<TopPodcastsResponse> {
    return this.client.get(url); // Petición HTTP
  }
}

// 6. Infrastructure Layer - Mapper
export const mapToPodcastList = (response: TopPodcastsResponse): Podcast[] => {
  return response.feed.entry.map((entry) => ({
    id: entry.id.attributes['im:id'],
    title: entry['im:name'].label,
    // ... más campos
  }));
};
```

### Caso 2: Filtrar Podcasts

**Flujo completo:**

```typescript
// 1. Presentation Layer - Hook
export const useFilteredPodcasts = (searchTerm: string) => {
  const { podcasts } = useTopPodcasts(); // Obtiene podcasts (entidades del dominio)
  const filterPodcasts = new FilterPodcasts(); // Caso de uso

  const filtered = useMemo(() => {
    return filterPodcasts.execute(podcasts, searchTerm); // Filtra directamente
  }, [podcasts, searchTerm]);

  return { podcasts: filtered };
};

// 2. Application Layer - Use Case
export class FilterPodcasts {
  execute(podcasts: Podcast[], searchTerm: string): Podcast[] {
    // Lógica simple de filtrado para la UI
    // Trabaja con entidades del dominio
    const normalizedTerm = searchTerm.trim().toLowerCase();
    if (!normalizedTerm) {
      return podcasts;
    }

    return podcasts.filter((podcast) => {
      const podcastTitle = podcast.title.toLowerCase();
      const podcastAuthor = podcast.author.toLowerCase();
      return podcastTitle.includes(normalizedTerm) || podcastAuthor.includes(normalizedTerm);
    });
  }
}
```

**Nota:** Este filtrado es lógica simple de aplicación (presentación), no lógica de negocio compleja. Por eso está en el use case, no en un Domain Service.

### Caso 3: Convertir a DTOs

**Flujo completo:**

```typescript
// 1. Application Layer - Service
export class PodcastCardService {
  mapToCardDTOs(podcasts: Podcast[]): PodcastCardDTO[] {
    return mapPodcastsToCardDTOs(podcasts); // Usa mapper
  }
}

// 2. Application Layer - Mapper
export const mapPodcastToCardDTO = (podcast: Podcast): PodcastCardDTO => ({
  id: podcast.id,
  title: podcast.title,
  author: podcast.author,
  imageUrl: podcast.imageUrl,
  // NO incluye 'summary' para optimizar
});

export const mapPodcastsToCardDTOs = (podcasts: Podcast[]): PodcastCardDTO[] =>
  podcasts.map(mapPodcastToCardDTO);

// 3. Presentation Layer - Component
export const PodcastCard = ({ podcast }: { podcast: PodcastCardDTO }) => {
  return (
    <article>
      <img src={podcast.imageUrl} alt={podcast.title} />
      <h3>{podcast.title}</h3>
      <p>Author: {podcast.author}</p>
      {/* No muestra 'summary' porque no está en el DTO */}
    </article>
  );
};
```

---

## Diferencias entre Mappers

### Mappers de Infrastructure (API → Domain)

**Ubicación:** `src/features/podcasts/infrastructure/mappers/`

**Propósito:** Convertir datos de APIs externas a entidades del dominio.

**Ejemplo:**

```typescript
// podcastMapper.ts (Infrastructure)
export const mapToPodcastList = (response: TopPodcastsResponse): Podcast[] => {
  // Convierte formato de iTunes API a Podcast entity
  return response.feed.entry.map((entry) => ({
    id: entry.id.attributes['im:id'],
    title: entry['im:name'].label,
    author: entry['im:artist'].label,
    // ...
  }));
};
```

**Características:**

- ✅ Dependen de infraestructura (conocen formatos de API)
- ✅ Convierten datos externos a formato interno
- ✅ Manejan normalización de datos de diferentes fuentes
- ✅ Usan valores por defecto cuando faltan datos

**En la arquitectura:**

- Pertenecen a la capa de infraestructura
- Son "adaptadores" que traducen formato externo a interno
- Solo se usan dentro de la infraestructura

### Mappers de Application (Domain → DTO)

**Ubicación:** `src/features/podcasts/application/mappers/`

**Propósito:** Convertir entidades del dominio a DTOs optimizados para la UI.

**Ejemplo:**

```typescript
// podcastCardMapper.ts (Application)
export const mapPodcastToCardDTO = (podcast: Podcast): PodcastCardDTO => ({
  id: podcast.id,
  title: podcast.title,
  author: podcast.author,
  imageUrl: podcast.imageUrl,
  // NO incluye 'summary' para reducir memoria
});
```

**Características:**

- ✅ No dependen de infraestructura (solo conocen dominio y DTOs)
- ✅ Optimizan datos para la presentación
- ✅ Excluyen campos pesados cuando no son necesarios
- ✅ Reducen el uso de memoria

**En la arquitectura:**

- Pertenecen a la capa de aplicación
- Son "traductores" que adaptan dominio a presentación
- Se usan por servicios de aplicación

### Comparación Visual

```
API Response (iTunes)          Podcast Entity (Domain)        PodcastCardDTO (Application)
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│ feed: {          │          │ {                │          │ {                │
│   entry: [       │   ────>  │   id: string     │   ────>  │   id: string     │
│     {            │          │   title: string  │          │   title: string  │
│       'im:id':   │          │   author: string │          │   author: string │
│       'im:name': │          │   imageUrl: str  │          │   imageUrl: str  │
│       summary:   │          │   summary: str   │          │                  │
│     }            │          │ }                │          │ }                │
│   ]              │          │                  │          │                  │
│ }                │          │                  │          │                  │
└──────────────────┘          └──────────────────┘          └──────────────────┘
   Infrastructure                  Domain                        Application
   Mapper (API→Domain)                                             Mapper (Domain→DTO)
```

---

## Preguntas Frecuentes

### ¿Por qué hay mappers en application y en infrastructure?

**Mappers de Infrastructure (API → Domain):**

- Convierten datos de APIs externas a entidades del dominio
- Normalizan formatos externos
- Ejemplo: `mapToPodcastList()` convierte respuesta de iTunes API a `Podcast[]`

**Mappers de Application (Domain → DTO):**

- Convierten entidades del dominio a DTOs optimizados para la UI
- Seleccionan solo campos necesarios
- Ejemplo: `mapPodcastToCardDTO()` convierte `Podcast` a `PodcastCardDTO`

### ¿Por qué necesitamos DTOs si ya tenemos Entities?

**DTOs optimizan para la UI:**

- Excluyen campos pesados (como `summary`) cuando no son necesarios
- Reducen el uso de memoria
- Facilitan la transferencia entre capas

**Entities son el modelo del dominio:**

- Contienen todos los campos del negocio
- Son independientes de la UI
- Pueden ser reutilizados en diferentes contextos

### ¿Dónde va la lógica de negocio?

**Domain Layer:**

- Reglas de negocio complejas → Domain Services
- Lógica simple → Entities
- **Importante:** Domain Services solo trabajan con entidades del dominio, nunca con DTOs

**Application Layer:**

- Orquestación y lógica simple de aplicación (filtrado, transformación para UI)
- Coordina entre dominio e infraestructura
- Ejemplo: `FilterPodcasts` implementa filtrado simple para la UI trabajando con entidades del dominio

**Regla de oro:**

- **Lógica de negocio compleja** → Domain Services
- **Lógica simple de aplicación/presentación** → Use Cases
- **Domain Services NO pueden depender de capas externas (DTOs, APIs, etc.)**

### ¿Cómo se comunican las capas?

**Regla de dependencia:**

```
Presentation → Application → Domain ← Infrastructure
```

- ✅ Presentation puede usar Application
- ✅ Application puede usar Domain
- ✅ Infrastructure puede usar Domain
- ❌ Domain NO puede usar otras capas
- ❌ Application NO puede usar Infrastructure directamente

### ¿Qué pasa si cambio de API?

**Solo necesitas cambiar Infrastructure:**

1. Crear nuevo API Client
2. Crear nuevos mappers (API → Domain)
3. Implementar nuevo Repository
4. **No necesitas cambiar Domain ni Application**

**Ejemplo:**

```typescript
// Antes: ITunesPodcastRepository
// Después: SpotifyPodcastRepository

// El dominio y la aplicación NO cambian
// Solo cambia la implementación del repositorio
```

---

## Resumen

### Componentes por Capa

| Capa               | Componentes                                                          | Responsabilidad                |
| ------------------ | -------------------------------------------------------------------- | ------------------------------ |
| **Domain**         | Entities, Repository Interfaces, Domain Services                     | Lógica de negocio pura         |
| **Application**    | Use Cases, DTOs, Application Services, Mappers (Domain→DTO)          | Orquestación y transformación  |
| **Infrastructure** | Repository Implementations, API Clients, Mappers (API→Domain), Cache | Conexión con el mundo exterior |
| **Presentation**   | Hooks, Components                                                    | Mostrar datos al usuario       |

### Flujo Típico

1. **Usuario interactúa** → Componente
2. **Componente** → Hook
3. **Hook** → Use Case
4. **Use Case** → Repository Interface
5. **Repository Implementation** → API Client
6. **API Client** → API Externa
7. **Respuesta API** → Mapper (API→Domain)
8. **Domain Entity** → Use Case
9. **Use Case** → Application Service
10. **Application Service** → Mapper (Domain→DTO)
11. **DTO** → Hook
12. **Hook** → Componente
13. **Componente** → Usuario

### Ventajas de esta Arquitectura

- ✅ **Testabilidad:** Cada capa se testea independientemente
- ✅ **Mantenibilidad:** Cambios en una capa no afectan otras
- ✅ **Escalabilidad:** Fácil añadir nuevas features
- ✅ **Reutilización:** El dominio puede usarse en diferentes plataformas
- ✅ **Claridad:** Cada componente tiene una responsabilidad clara

---

## Conclusión

Esta arquitectura hexagonal separa claramente las responsabilidades:

- **Domain:** "¿Qué es un podcast?" (lógica de negocio)
- **Application:** "¿Cómo obtengo podcasts?" (orquestación)
- **Infrastructure:** "¿Dónde están los podcasts?" (APIs, caché)
- **Presentation:** "¿Cómo muestro podcasts?" (UI)

Cada componente tiene un propósito claro y trabaja junto con los demás para crear una aplicación robusta, mantenible y escalable.
