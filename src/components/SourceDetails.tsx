import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Source } from '@/types'
import { updateSource, createSource } from '@/services/sources'
import { ExternalLink, Edit, Save, X, Loader2, Info } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getCountries } from '@/services/countries'
import { Country } from '@/types'
import { useEffect } from 'react'

const sourceSchema = z.object({
  url: z.string().url('URL deve ser válida'),
  country: z.string().min(1, 'País é obrigatório'),
  type: z.enum(['concorrente', 'externa', 'empresa']),
})

type SourceFormData = z.infer<typeof sourceSchema>

interface SourceDetailsProps {
  source: Source | null
  isOpen: boolean
  onClose: () => void
  onSourceUpdated?: (updatedSource: Source) => void
  onSourceCreated?: (newSource: Source) => void
  mode?: 'view' | 'edit' | 'create'
}

export const SourceDetails = ({
  source,
  isOpen,
  onClose,
  onSourceUpdated,
  onSourceCreated,
  mode = 'view',
}: SourceDetailsProps) => {
  const [isEditing, setIsEditing] = useState(mode === 'create' || mode === 'edit')
  const [isLoading, setIsLoading] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])

  const isCreateMode = mode === 'create'

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SourceFormData>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      url: isCreateMode ? '' : (source?.url ?? ''),
      country: isCreateMode ? '' : (source?.country ?? ''),
      type: source?.type ?? 'externa',
    },
  })

  const watchedUrl = watch('url')

  const handleClose = () => {
    reset({
      url: '',
      country: '',
      type: 'externa',
    })
    setIsEditing(false)
    onClose()
  }

  const handleEdit = () => {
    setIsEditing(true)
    reset({
      url: source?.url ?? '',
      country: source?.country ?? '',
      type: source?.type ?? 'externa',
    })
  }

  const handleCancel = () => {
    reset({
      url: source?.url ?? '',
      country: source?.country ?? '',
    })
    if (isEditing) {
      setIsEditing(false)
    } else {
      onClose()
    }
  }

  const onSubmit = async (data: SourceFormData) => {
    setIsLoading(true)
    try {
      if (isCreateMode) {
        const selectedCountry = countries.find((c) => c.name === data.country)

        if (!selectedCountry) {
          throw new Error('País não encontrado')
        }

        const createData = {
          url: data.url,
          type: data.type,
          countryId: selectedCountry.id,
        }

        const newSource = await createSource(createData)

        toast.success('Fonte criada com sucesso!')
        onSourceCreated?.(newSource)
        handleClose()
      } else if (source) {
        const selectedCountry = countries.find((c) => c.name === data.country)

        const updateData = {
          url: data.url,
          type: data.type,
          countryId: selectedCountry?.id,
        }

        const updatedSource = await updateSource(source.id, updateData)

        toast.success('Fonte atualizada com sucesso!')
        setIsEditing(false)
        onSourceUpdated?.(updatedSource)
      }
    } catch (error) {
      console.error('Error saving source:', error)
      toast.error(isCreateMode ? 'Erro ao criar fonte' : 'Erro ao atualizar fonte')
    } finally {
      setIsLoading(false)
    }
  }

  if (!source && !isCreateMode) return null

  const generateName = (url: string) => {
    const regex = /^https?:\/\/(?:www\.)?([^/]+)/i
    const match = regex.exec(url)
    if (!match) return url
    const domain = match[1]
    const domainWithoutTld = domain.replace(/\.com\.br$/, '.com').replace(/\.[^.]+$/, '')
    return domainWithoutTld
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">
              {isCreateMode
                ? 'Nova Fonte'
                : isEditing
                  ? generateName(watchedUrl)
                  : (source?.name ?? 'Fonte')}
            </SheetTitle>
            <div className="mr-4 flex gap-2">
              {!isEditing && !isCreateMode ? (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit(onSubmit)} // eslint-disable-line
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {isCreateMode ? 'Criar' : 'Salvar'}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <SheetDescription>
            {!isEditing && !isCreateMode && source && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-2 hover:underline"
              >
                {source.url} <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {isCreateMode && (
              <span className="text-muted-foreground">Preencha os dados da nova fonte</span>
            )}
          </SheetDescription>
        </SheetHeader>

        {(isEditing || isCreateMode) && (
          <div className="mb-6 space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                {...register('url')}
                placeholder={
                  isCreateMode
                    ? 'https://exemplo.com/rss ou https://exemplo.com/feed'
                    : 'https://exemplo.com'
                }
                className={errors.url ? 'border-red-500' : ''}
              />
              {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>}
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Select
                value={watch('country')}
                onValueChange={(value) => setValue('country', value)}
              >
                <SelectTrigger id="country" className={errors.country ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione um país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={watch('type')}
                onValueChange={(value) =>
                  setValue('type', value as 'concorrente' | 'externa' | 'empresa')
                }
              >
                <SelectTrigger id="type" className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concorrente">Concorrente</SelectItem>
                  <SelectItem value="externa">Externa</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>}
            </div>
          </div>
        )}

        {isCreateMode && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Adicione a URL de um feed RSS válido. O sistema irá
              monitorar este feed para coletar artigos automaticamente. Exemplo:{' '}
              <code className="bg-muted rounded px-1 text-xs">https://exemplo.com/rss</code>
            </AlertDescription>
          </Alert>
        )}

        {!isCreateMode && source && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold">Detalhes</h3>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p>
                  <strong>País:</strong> {source.country}
                </p>
                <p>
                  <strong>Continente:</strong> {source.continent}
                </p>
                <p>
                  <strong>Cadastrado em:</strong>{' '}
                  {new Date(source.createdAt).toLocaleString('pt-BR')}
                </p>
                <p>
                  <strong>Última Leitura:</strong>{' '}
                  {new Date(source.lastRead).toLocaleString('pt-BR')}
                </p>
                <p className="capitalize">
                  <strong>Tipo:</strong> {source.type}
                </p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
