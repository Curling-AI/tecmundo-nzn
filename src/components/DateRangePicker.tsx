import { useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useDateFilter } from '@/store/dateFilter'

const presets = [
  { value: 'today', label: 'Hoje' },
  { value: 'last7', label: 'Últimos 7 dias' },
  { value: 'last30', label: 'Últimos 30 dias' },
  { value: 'thisMonth', label: 'Este mês' },
  { value: 'lastMonth', label: 'Mês passado' },
]

export function DateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const { date, setDate, setPreset } = useDateFilter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'bg-card w-full justify-start text-left font-normal md:w-[240px] lg:w-[300px]',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yy', { locale: ptBR })} -{' '}
                  {format(date.to, 'dd/MM/yy', { locale: ptBR })}
                </>
              ) : (
                format(date.from, 'dd/MM/yy', { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col space-y-2 border-b p-4 md:border-r md:border-b-0">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    setPreset(
                      preset.value as 'today' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth',
                    )
                    setIsOpen(false)
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="p-2">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={ptBR}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
