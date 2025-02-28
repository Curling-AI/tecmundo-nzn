import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

// Função auxiliar para remover diretório recursivamente
function removeDirRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
    console.log(`✓ Removed: ${dir}`)
  }
}

// Função auxiliar para remover arquivo
function removeFile(file) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    console.log(`✓ Removed: ${file}`)
  }
}

// Função auxiliar para criar diretório se não existir
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✓ Created directory: ${dir}`)
  }
}

// Função auxiliar para criar arquivo
function createFile(file, content) {
  ensureDirectoryExists(path.dirname(file))
  fs.writeFileSync(file, content)
  console.log(`✓ Created: ${file}`)
}

// Função para remover o script setup do package.json
function removeSetupFromPackageJson() {
  console.log('\n🔧 Removing script setup from package.json...')
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Remove o script setup
  if (packageJson.scripts && packageJson.scripts.setup) {
    delete packageJson.scripts.setup
    console.log('✓ Script setup removed from package.json')
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  }
}

// Função para atualizar o arquivo de rotas
function updateAppRoutes() {
  console.log('\n🔧 Updating application routes...')
  const appPath = 'src/app.tsx'

  if (fs.existsSync(appPath)) {
    // Novo conteúdo do arquivo com apenas a rota do index
    const newContent = `import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, RouteProps } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Loader2 } from 'lucide-react'
import { Toaster } from './components/ui/sonner'

const routes: RouteProps[] = [
  {
    index: true,
    path: '/',
    Component: lazy(() => import('./pages/index')),
  },
]

const loading = (
  <div className="flex min-h-screen items-center justify-center">
    <Loader2 className="text-primary h-8 w-8 animate-spin" />
  </div>
)

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <Suspense fallback={loading}>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </ThemeProvider>
  )
}

export { App }
`

    fs.writeFileSync(appPath, newContent)
    console.log('✓ Routes updated in src/app.tsx')
  }
}

// Função para commitar as mudanças no git
function commitSetupChanges() {
  console.log('\n🔧 Committing changes to git...')

  try {
    // Adiciona todas as mudanças ao stage
    execSync('git add .', { stdio: 'inherit' })
    console.log('✓ Changes staged')

    // Cria o commit com uma mensagem descritiva
    execSync('git commit -m "chore: cleanup starter kit and setup minimal structure"', {
      stdio: 'inherit',
    })
    console.log('✓ Changes committed')
  } catch (error) {
    console.log('⚠️  Unable to commit changes:', error.message)
  }
}

// Remover diretórios
console.log('\n🗑️  Removing directories...')
removeDirRecursive('src/components/features')
removeDirRecursive('src/components/howto')
removeDirRecursive('src/components/layout')
removeDirRecursive('src/components/logos')

// Remover arquivos
console.log('\n🗑️  Removing files...')
removeFile('src/pages/about.tsx')
removeFile('src/pages/start.tsx')
removeFile('src/pages/index.tsx')

// Criar nova página index
console.log('\n📝 Creating new index page...')
const indexContent = `import { FC } from 'react';
import { MainLayout } from '../components/layout/main-layout';

const IndexPage: FC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-2xl w-full text-center space-y-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Welcome to Your Project
          </h1>
          <p className="text-xl text-gray-600">
            This is the starting point to create something amazing.
            Customize this page according to your needs.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://sbc-cursor-starter-kit.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
            <a
              href="https://github.com/m4n3z40/sbc-cursor-starter-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IndexPage;
`

// Criar novo layout
console.log('\n📝 Creating new layout...')
const layoutContent = `import { FC, PropsWithChildren } from 'react';

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-gray-900">
              Your Project
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/m4n3z40/sbc-cursor-starter-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              GitHub
            </a>
            <a
              href="https://github.com/m4n3z40/sbc-cursor-starter-kit/blob/main/README.md"
              className="text-gray-600 hover:text-gray-900"
            >
              Documentation
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Your Project. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
`

createFile('src/pages/index.tsx', indexContent)
createFile('src/components/layout/main-layout.tsx', layoutContent)

// Atualizar rotas removendo as páginas excluídas
updateAppRoutes()

// Remover script setup do package.json
removeSetupFromPackageJson()

// Remover o hook post-install
console.log('\n🗑️  Removing post-install hook...')
removeFile('.husky/post-install')

// Remover o próprio arquivo de setup
console.log('\n🗑️  Removing setup file...')
process.on('exit', () => {
  try {
    // Remove o próprio arquivo de setup
    fs.unlinkSync(import.meta.filename)
    console.log('✓ Setup file removed')

    // Commit das mudanças no git
    commitSetupChanges()
    console.log('\n✨ Setup completed successfully!')
  } catch (err) {
    console.log(err)
    console.log('⚠️  Unable to remove setup file automatically')
  }
})
