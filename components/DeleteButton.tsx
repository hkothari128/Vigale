import axios from 'axios';
import React, { useCallback, useMemo, useState } from 'react';

import useCurrentUser from '@/hooks/useCurrentUser';
import useFavorites from '@/hooks/useFavorites';
import useVideos from '@/hooks/useVideoList';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import ConfirmDialog from './ConfirmDialog';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TrashIcon } from '@heroicons/react/24/outline';
interface DeleteButtonProps {
  movieId: string,
  title: string
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ movieId, title }) => {
  const { mutate: mutateVideos } = useVideos();
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: currentUser, mutate } = useCurrentUser();

  const deleteVideo = async () => {
    const delRes = await axios.delete('/api/videos/'+movieId)
    if(delRes.status==200){
      alert(`Video ${title} has been deleted Successfully`);
      mutateVideos()
    }
  } 


  

  return (
    <div>
      <div onClick={() => setConfirmOpen(true)} className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300">
      <TrashIcon className="text-white group-hover/item:text-neutral-300 w-4 lg:w-6" aria-label="delete" />
    </div>
  <ConfirmDialog
    title="Delete Post?"
    open={confirmOpen}
    onClose={() => setConfirmOpen(false)}
    onConfirm={deleteVideo}
  >
    Are you sure you want to delete video: {title}?
  </ConfirmDialog>
</div>
  )
}

export default DeleteButton;
