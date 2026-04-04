import type { Ref } from 'vue'

export function useNullableString<T extends object>(form: Ref<T>, key: keyof T) {
  return computed({
    get: () => (form.value[key] as string | null | undefined) ?? undefined,
    set: (val: string | undefined) => {
      ;(form.value[key] as string | null | undefined) = val ?? null
    }
  })
}

export function useNullableNumber<T extends object>(form: Ref<T>, key: keyof T) {
  return computed({
    get: () => (form.value[key] as number | null | undefined) ?? undefined,
    set: (val: number | undefined) => {
      ;(form.value[key] as number | null | undefined) = val ?? null
    }
  })
}

export function useNullableDate<T extends object>(form: Ref<T>, key: keyof T) {
  return computed({
    get: () => {
      const val = form.value[key] as string | null | undefined
      if (!val) return undefined
      return val.slice(0, 10)
    },
    set: (val: string | undefined) => {
      ;(form.value[key] as string | null | undefined) = val ?? null
    }
  })
}
