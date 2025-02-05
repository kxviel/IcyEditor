import QuestionBuilder from '@/features/Builder/QuestionBuilder'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/builder')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full">
      <QuestionBuilder />
    </div>
  )
}
