const generateId = () =>
  Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

type SortField = string;

interface EntityRecord {
  id: string;
  created_date: string;
  [key: string]: unknown;
}

const createLocalEntity = (entityName: string) => {
  const key = `b44_${entityName}`;
  const load = (): EntityRecord[] => JSON.parse(localStorage.getItem(key) || '[]');
  const save = (data: EntityRecord[]) => localStorage.setItem(key, JSON.stringify(data));

  return {
    async list(sortBy?: SortField, limit?: number): Promise<EntityRecord[]> {
      let data = load();
      if (sortBy) {
        const desc = sortBy.startsWith('-');
        const field = desc ? sortBy.slice(1) : sortBy;
        data = [...data].sort((a, b) => {
          const av = a[field] as string | number;
          const bv = b[field] as string | number;
          if (av < bv) return desc ? 1 : -1;
          if (av > bv) return desc ? -1 : 1;
          return 0;
        });
      }
      return limit ? data.slice(0, limit) : data;
    },
    async filter(query: Record<string, unknown>): Promise<EntityRecord[]> {
      const data = load();
      if (!query || Object.keys(query).length === 0) return data;
      return data.filter(item =>
        Object.entries(query).every(([k, v]) => item[k] === v)
      );
    },
    async get(id: string): Promise<EntityRecord | null> {
      return load().find(item => item.id === id) || null;
    },
    async create(item: Omit<EntityRecord, 'id' | 'created_date'>): Promise<EntityRecord> {
      const data = load();
      const newItem: EntityRecord = { ...item, id: generateId(), created_date: new Date().toISOString() };
      save([...data, newItem]);
      return newItem;
    },
    async update(id: string, updates: Partial<EntityRecord>): Promise<EntityRecord> {
      const data = load();
      const i = data.findIndex(item => item.id === id);
      if (i === -1) throw new Error(`${entityName} record not found: ${id}`);
      data[i] = { ...data[i], ...updates };
      save(data);
      return data[i];
    },
    async delete(id: string): Promise<{}> {
      save(load().filter(item => item.id !== id));
      return {};
    },
    async bulkCreate(items: Omit<EntityRecord, 'id' | 'created_date'>[]): Promise<EntityRecord[]> {
      const data = load();
      const newItems = items.map(item => ({
        ...item,
        id: generateId(),
        created_date: new Date().toISOString(),
      }));
      save([...data, ...newItems]);
      return newItems;
    },
  };
};

type EntityStore = ReturnType<typeof createLocalEntity>;

export const localDb = {
  auth: {
    async isAuthenticated() { return true; },
    async me() { return { id: 'local-user-1', email: 'user@maruvkalab.local', full_name: 'Lab User' }; },
    logout() {},
  },
  entities: new Proxy({} as Record<string, EntityStore>, {
    get(_: Record<string, EntityStore>, entityName: string) {
      return createLocalEntity(String(entityName));
    },
  }) as Record<string, EntityStore>,
  integrations: {
    Core: {
      async UploadFile({ file }: { file: File }): Promise<{ file_url: string }> {
        return { file_url: URL.createObjectURL(file) };
      },
    },
  },
};
