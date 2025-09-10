import { create } from 'zustand'
import { DateRange } from 'react-day-picker'
import { startOfToday, subDays, startOfMonth, endOfMonth, subMonths, endOfToday } from 'date-fns'

type Preset = 'today' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'custom'

interface DateFilterState {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  setPreset: (preset: Preset) => void
}

export const useDateFilter = create<DateFilterState>((set) => ({
  date: { from: startOfToday(), to: endOfToday() },
  setPreset: (preset) => {
    switch (preset) {
      case 'today':
        set({ date: { from: startOfToday(), to: endOfToday() } })
        break
      case 'last7':
        set({ date: { from: subDays(startOfToday(), 6), to: endOfToday() } })
        break
      case 'last30':
        set({ date: { from: subDays(startOfToday(), 29), to: endOfToday() } })
        break
      case 'thisMonth':
        set({ date: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) } })
        break
      case 'lastMonth':
        set({ date: { from: subMonths(startOfMonth(new Date()), 1), to: endOfMonth(new Date()) } })
        break
      case 'custom':
        set({ date: undefined })
        break
    }
  },
  setDate: (date) => set({ date }),
}))
