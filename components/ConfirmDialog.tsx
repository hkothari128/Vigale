import Dialog from './Dialog';

interface Props {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onClose: Function;
  onConfirm: Function; 
}
export default function Confirm(props: Props) {
  const { open, onClose, title, children, onConfirm } = props;
  if (!open) {
    return <></>;
  }
  
  return (
    <Dialog open={open} onClose={onClose}>
      <h2 className="text-xl">{title}</h2>
      <div className="py-5">{children}</div>
      <div className="flex justify-end">
        <div className="p-1">
          <div
            onClick={() => onClose()}
            className="bg-secondary hover:bg-secondary-light"
          >
            No
          </div>
        </div>
        <div className="p-1">
          <div
            onClick={() => {
              onClose();
              onConfirm();
            }}
          >
            Yes
          </div>
        </div>
      </div>
    </Dialog>
  );
}