import { Copy } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface CopyCodeProps {
  code: string
  className?: string
}

export function CopyCode({ code, className }: CopyCodeProps) {
  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text)
  }

  return (
    <div className={cn('relative rounded-lg border p-4', className)}>
      <div className="absolute top-8 right-6">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => copyToClipboard(code)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <pre className="bg-muted mt-2 rounded p-2 whitespace-pre-wrap">
        <code className="text-foreground">{code}</code>
      </pre>
    </div>
  )
}
