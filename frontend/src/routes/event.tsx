import { createFileRoute } from '@tanstack/react-router'
import EventBoard from '../components/event'
export const Route = createFileRoute('/event')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EventBoard />

}
