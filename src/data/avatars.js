// The 9 pickable avatar images. Right now these are generated color
// placeholders (src/assets/avatars/avatar-N.jpg) — to swap in a real
// photo, replace that file (or point the import at a new one) and
// nothing else in the app needs to change: the picker grid, the
// selected-avatar circle in the header, and the `avatar_key` stored in
// Supabase (supabase/schema.sql → profiles.avatar_key) all just
// reference these ids, not the files directly.
import avatar1 from '../assets/avatars/avatar-1.jpg'
import avatar2 from '../assets/avatars/avatar-2.jpg'
import avatar3 from '../assets/avatars/avatar-3.jpg'
import avatar4 from '../assets/avatars/avatar-4.jpg'
import avatar5 from '../assets/avatars/avatar-5.jpg'
import avatar6 from '../assets/avatars/avatar-6.jpg'
import avatar7 from '../assets/avatars/avatar-7.jpg'
import avatar8 from '../assets/avatars/avatar-8.jpg'
import avatar9 from '../assets/avatars/avatar-9.jpg'

export const avatarOptions = [
  { id: 'avatar-1', src: avatar1 },
  { id: 'avatar-2', src: avatar2 },
  { id: 'avatar-3', src: avatar3 },
  { id: 'avatar-4', src: avatar4 },
  { id: 'avatar-5', src: avatar5 },
  { id: 'avatar-6', src: avatar6 },
  { id: 'avatar-7', src: avatar7 },
  { id: 'avatar-8', src: avatar8 },
  { id: 'avatar-9', src: avatar9 },
]

export function avatarSrcById(id) {
  return avatarOptions.find((a) => a.id === id)?.src
}
