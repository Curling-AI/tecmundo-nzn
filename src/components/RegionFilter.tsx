import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const regions = [
  { value: 'all', label: 'País/Continente' },
  { value: 'brasil', label: 'Brasil' },
  { value: 'internacional', label: 'Internacional' },
  { value: 'america-do-sul', label: 'America do Sul' },
  { value: 'america-do-norte', label: 'America do Norte' },
  { value: 'africa', label: 'Africa' },
  { value: 'europa', label: 'Europa' },
  { value: 'asia', label: 'Ásia' },
  { value: 'oceania', label: 'Oceania' },
]

interface RegionFilterProps {
  selectedRegion: string
  onRegionChange: (region: string) => void
}

export const RegionFilter = ({ selectedRegion, onRegionChange }: RegionFilterProps) => {
  return (
    <Select value={selectedRegion} onValueChange={onRegionChange}>
      <SelectTrigger className="bg-card w-full md:w-[220px]">
        <SelectValue placeholder="País/Continente" />
      </SelectTrigger>
      <SelectContent>
        {regions.map((region) => (
          <SelectItem key={region.value} value={region.value}>
            {region.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
