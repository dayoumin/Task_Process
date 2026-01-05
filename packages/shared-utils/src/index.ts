import { format, formatDistance } from 'date-fns'

/**
 * UUID v4 생성
 */
export function generateUUID(): string {
  return crypto.randomUUID()
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: Date, formatStr = 'yyyy-MM-dd HH:mm:ss'): string {
  return format(date, formatStr)
}

/**
 * 상대 시간 표시
 */
export function formatRelativeTime(date: Date): string {
  return formatDistance(date, new Date(), { addSuffix: true })
}

/**
 * LocalStorage 헬퍼
 */
export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    const item = localStorage.getItem(key)
    if (!item) return null
    try {
      return JSON.parse(item) as T
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },

  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.clear()
  },
}

/**
 * IndexedDB 헬퍼
 */
export const indexedDB = {
  async open(dbName: string, version = 1, onUpgrade?: (db: IDBDatabase) => void): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, version)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        onUpgrade?.(db)
      }
    })
  },

  async getAll<T>(db: IDBDatabase, storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result as T[])
    })
  },

  async add<T>(db: IDBDatabase, storeName: string, data: T): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(data)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  },

  async put<T>(db: IDBDatabase, storeName: string, data: T): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  },

  async delete(db: IDBDatabase, storeName: string, key: IDBValidKey): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  },
}
