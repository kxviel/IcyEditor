import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/auto-builder')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/auto-builder"!</div>
}
