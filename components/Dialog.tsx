import {FaCross} from 'react-icons/fa'
import ReactModal from 'react-modal';
interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  onClose: Function;
}
const Dialog:React.FC<DialogProps> = ({open,onClose,children}) => {
  
  if (!open) {
    return <></>;
  }
  return (

    <ReactModal isOpen={open} onRequestClose={()=>onClose()} shouldCloseOnEsc shouldCloseOnOverlayClick className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">{children}</ReactModal>
  //   <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
  //     <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
  //     <div>{children}</div>
  //     <span className="absolute top-0 right-0 p-4">     
  //      <FaCross onClick={() => onClose()} />
  //    </span>
  //    </div>
  //  </div>
 );
}
export default Dialog