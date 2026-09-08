import { redirect } from 'next/navigation'

/* /people has no index of its own yet; the board is the only thing
   under it. Mirrors app/about/page.js so the bare segment is not a 404. */
export default function People() {
  redirect('/people/board')
}
