import { FC } from 'react'
import { MainLayout } from '../components/layout/main-layout'

const IndexPage: FC = () => {
  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent">
            Welcome to Your Project
          </h1>
          <p className="text-xl text-gray-600">
            This is the starting point to create something amazing. Customize this page according to
            your needs.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://sbc-cursor-starter-kit.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Get Started
            </a>
            <a
              href="https://github.com/m4n3z40/sbc-cursor-starter-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gray-100 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default IndexPage
